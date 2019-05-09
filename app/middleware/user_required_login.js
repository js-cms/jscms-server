/**
 * 中间件：需要用户登陆
 */

'use strict';

module.exports = options => {
  return async function (ctx, next) {
    const app = ctx.app;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return app.throwJsonError('你没有登录', 403);
    } else {
      await next();
    }
  };
};