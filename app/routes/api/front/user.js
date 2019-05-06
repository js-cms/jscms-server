/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/front/user/login', controller.api.front.user.login); // 用户登录
  router.post('/api/front/user/register', controller.api.front.user.register); // 用户注册
  router.get('/api/front/user/logout', controller.api.front.user.logout); // 用户注销
  router.get('/api/front/user/getInfo', controller.api.front.user.getInfo); // 用户读取信息
  router.get('/api/front/user/updateInfo', controller.api.front.user.updateInfo); // 用户修改信息
  router.get('/api/front/user/updatePassword', controller.api.front.user.updatePassword); // 用户修改密码
}
