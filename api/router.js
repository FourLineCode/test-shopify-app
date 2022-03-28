import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import { gql } from "apollo-boost";
import Router from "koa-router";
import { createClient } from "../server/handlers/client";

const router = Router({ prefix: "/api/v1" });

router.get("/hello", verifyRequest(), (ctx) => {
  ctx.body = { message: "This is message from Internal API" };
});

router.get("/products", verifyRequest(), async (ctx) => {
  try {
    const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(
      ctx.req,
      ctx.res
    );
    if (shop && accessToken) {
      const client = createClient(shop, accessToken);

      const { data } = await client.query({
        query: gql`
          query GetProducts {
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  createdAt
                  priceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        `,
      });

      let products;
      if (data && data.products) {
        products = data.products.edges.map(({ node }) => node);
      }

      ctx.statusCode = 200;
      ctx.body = products;
    } else {
      ctx.statusCode = 400;
      ctx.body = {
        error: {
          message: "Unauthorized",
        },
      };
    }
  } catch (error) {
    console.log(error);
    ctx.statusCode = 500;
    ctx.body = {
      error: {
        message: "Internal Server Error",
      },
    };
  }
});

export default router;
