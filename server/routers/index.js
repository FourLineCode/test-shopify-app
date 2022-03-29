import { verifyRequest } from "@shopify/koa-shopify-auth";
import logger from "koa-logger";
import Router from "koa-router";
import { defaultErrorHandler } from "../middlewares/errorHandler";
import dashboardRouter from "./dashboard";

const apiRouter = Router({ prefix: "/api" });

apiRouter.use(logger());
apiRouter.use(defaultErrorHandler());
apiRouter.use(verifyRequest());

apiRouter.use("/dashboard", dashboardRouter.routes(), dashboardRouter.allowedMethods());

export default apiRouter;
