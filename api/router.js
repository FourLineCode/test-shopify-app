import Router from "koa-router";

const router = Router({ prefix: "/api/v1" });

router.get("/hello", (ctx) => {
  console.log("server request hit");
  ctx.body = { message: "This is message from Internal API" };
});

export default router;
