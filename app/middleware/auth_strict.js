'use strict';

module.exports = app => {
  // 验证用户
  return async function (ctx, next) {
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登录', 403);
    } else {
      await next();
    }
  };
};
