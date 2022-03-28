import { response } from "../utils/response";

const DEV = process.env.NODE_ENV !== "production";

export default function defaultErrorHandler() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (DEV) {
        console.log(error);
      }
      const code = error.statusCode || error.status || 500;
      const message = error.message || "Internal server error";
      response.error(ctx, code, message);
    }
  };
}
