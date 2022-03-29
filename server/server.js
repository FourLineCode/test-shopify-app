import "@babel/polyfill";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import dotenv from "dotenv";
import Koa from "koa";
import Router from "koa-router";
import next from "next";
import apiRouter from "./routers";
import { deleteCallback, loadAllSessions, loadCallback, storeCallback } from "./session/callbacks";

dotenv.config();

const DEV = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT, 10) || 8081;
// Localhost tunnel URL
const HOST = process.env.HOST;

// Next app handler
const app = next({ dev: DEV });
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.January22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback
  ),
});

// In memory map of all currently authenticated shops
const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (_topic, shop, _body) => delete ACTIVE_SHOPIFY_SHOPS[shop],
});

app.prepare().then(async () => {
  // Load all the currently active sessions from "~/sessions.json" into memory
  const activeSessions = await loadAllSessions();
  activeSessions.forEach((session) => {
    if (session?.shop && session?.scope) {
      ACTIVE_SHOPIFY_SHOPS[session.shop] = session.scope;
    }
  });

  const server = new Koa();
  const router = new Router();

  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      afterAuth: async (ctx) => {
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const responses = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
        });

        if (!responses["APP_UNINSTALLED"].success) {
          console.log(`Failed to register APP_UNINSTALLED webhook: ${responses.result}`);
        }

        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post("/graphql", verifyRequest({ returnHeader: true }), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  // Bevy Giveaway App internal api routes
  server.use(apiRouter.allowedMethods());
  server.use(apiRouter.routes());

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
