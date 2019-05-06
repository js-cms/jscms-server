/**
 * 中间件：获取用户信息
 */

'use strict';

module.exports = options => {
  return async function (ctx, next) {
    const app = ctx.app;
    const prefix = ctx.request.path.substring(0, 4);
    const currentTime = (new Date()).getTime();
    const token = ctx.headers['authorization'] || ctx.request.body.token || ctx.query.token;
    let res = null;
    let currentUser = {
      user: {},
      auth: {
        isLogin: false,
        isExpired: true
      }
    };
    //只判断api后缀请求
    if (prefix === "/api") {
      if (token) {
        //得到token是否存在
        res = await ctx.service.token.getTokenByToken({
          token: token
        });
        if (res) {
          //得到用户信息
          let user = await ctx.service.user.findOne({ _id: res.userId });
          if (user) {
            currentUser.user = user._doc;
            //得到token是否过期
            if (currentTime > res.passwExpiry) { //如果已经过期
              //删除这个token
              await ctx.service.token.removeByToken(token);
              currentUser.auth.isLogin = false;
              currentUser.auth.isExpired = true;
            } else {
              currentUser.auth.isLogin = true;
              currentUser.auth.isExpired = false;
            }
          }
        }
      }
    }
    ctx.locals.currentUser = currentUser;
    await next();
  };
};
