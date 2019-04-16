/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/login', controller.api.user.login); // 用户登陆
  router.get('/api/logout', controller.api.user.logout); // 用户登出
  router.get('/api/user', controller.api.user.show); // 获取单个用户信息
  router.get('/api/user/count', controller.api.user.count); // 获取用户总数
  router.get('/api/user/list', controller.api.user.list); // 获取用户列表（管理员接口）
  router.post('/api/user/password', controller.api.user.password); // 更改某个用户的密码（登陆用户）
  router.post('/api/user/create', controller.api.user.create); // 创建用户（超级管理员接口）
  router.post('/api/user/update', controller.api.user.update); // 更改某个用户的信息（超级管理员接口）
}
