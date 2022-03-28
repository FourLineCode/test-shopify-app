import Shopify from "@shopify/shopify-api";
import Router from "koa-router";
import { getAllProducts } from "../controllers/product";
import { response } from "../utils/response";

const productRouter = Router();

productRouter.get("/all", async (ctx) => {
  const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  if (shop && accessToken) {
    const products = await getAllProducts(shop, accessToken);
    response.success(ctx, products);
  } else {
    response.error(ctx, 400, "Unauthorized");
  }
});

export default productRouter;
