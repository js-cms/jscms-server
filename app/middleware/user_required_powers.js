/**
 * 中间件：需要用户身份为普通管理员
 */

'use strict';

module.exports = options => {
  return async function (ctx, next) {
    const app = ctx.app;
    const isLogin = ctx.locals.currentUser.auth.isLogin;
    if (!isLogin) {
      return app.throwJsonError('你没有登录', 403);
    } else if (!ctx.hasPowers(options.powers)) {
      return app.throwJsonError('你没有权限', 403);
    } else {
      await next();
    }
  };
};
