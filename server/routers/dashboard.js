import Router from "koa-router";
import { getDashboardResponse } from "../controllers/dashboard";
import { response } from "../utils/response";

const dashboardRouter = Router();

dashboardRouter.get("/", async (ctx) => {
  const messsge = getDashboardResponse();
  response.success(ctx, messsge);
});

export default dashboardRouter;
