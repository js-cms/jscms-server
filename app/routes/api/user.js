/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/user/super', controller.api.user.super); //创建超级管理员
  router.post('/api/login', controller.api.user.login); //用户登陆
  //router.post: ['/api/logout', controller.api.user.logout] //用户登出 #TODO
}
