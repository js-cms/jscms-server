/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/login', controller.api.user.login); //用户登陆
  router.get('/api/logout', controller.api.user.logout); //用户登出
}
