import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import Router from "koa-router";
import { getAllProducts } from "../controllers/products";
import { response } from "../utils/response";

const router = Router({ prefix: "/api/v1" });

router.use(verifyRequest({ returnHeader: true }));

router.get("/hello", (ctx) => {
  response.success(ctx, { message: "This is message from Internal API" });
});

router.get("/products", async (ctx) => {
  const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  if (shop && accessToken) {
    const products = await getAllProducts(shop, accessToken);
    response.success(ctx, products);
  } else {
    response.error(ctx, 400, "Unauthorized");
  }
});

export default router;
