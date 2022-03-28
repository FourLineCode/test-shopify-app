import { verifyRequest } from "@shopify/koa-shopify-auth";
import logger from "koa-logger";
import Router from "koa-router";
import { defaultErrorHandler } from "../middlewares/errorHandler";
import productRouter from "./product";

const apiRouter = Router({ prefix: "/api" });

apiRouter.use(logger());
apiRouter.use(defaultErrorHandler());
apiRouter.use(verifyRequest());

apiRouter.use("/product", productRouter.routes(), productRouter.allowedMethods());

export default apiRouter;
