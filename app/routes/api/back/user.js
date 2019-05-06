/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/back/login', controller.api.back.user.login); // 用户登录
  router.get('/api/back/logout', controller.api.back.user.logout); // 用户登出
  router.get('/api/back/user', controller.api.back.user.show); // 获取单个用户信息
  router.get('/api/back/user/count', controller.api.back.user.count); // 获取用户总数
  router.get('/api/back/user/list', controller.api.back.user.list); // 获取用户列表（管理员接口）
  router.post('/api/back/user/password', controller.api.back.user.password); // 更改某个用户的密码（登录用户）
  router.post('/api/back/user/create', controller.api.back.user.create); // 创建用户（超级管理员接口）
  router.post('/api/back/user/update', controller.api.back.user.update); // 更改某个用户的信息（超级管理员接口）
  router.post('/api/back/user/updateme', controller.api.back.user.updateme); // 更改当前用户的信息（管理员接口）
  router.post('/api/back/user/delete', controller.api.back.user.delete); // 删除某个用户（超级管理员接口）
}
