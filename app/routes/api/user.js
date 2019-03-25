/** 用户相关api */
module.exports = function(controller) {
  return {
    post: ['/api/user/super', controller.user.super], //创建超级管理员
    post: ['/api/login', controller.user.login] //用户登陆
    //post: ['/api/logout', controller.user.logout] //用户登出 #TODO
  }
}
