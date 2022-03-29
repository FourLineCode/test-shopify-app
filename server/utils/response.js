// Utility functions to return koa response
export const response = {
  error: (ctx, code, message) => {
    ctx.statusCode = code;
    ctx.body = {
      error: {
        message: message,
      },
    };
  },
  success: (ctx, body) => {
    ctx.statusCode = 200;
    ctx.body = body;
  },
};
