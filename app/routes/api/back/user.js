/** 用户相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/login', controller.api.back.user.login); // 用户登录
  router.get('/api/back/logout', powerAdmin, controller.api.back.user.logout); // 用户登出
  router.get('/api/back/user', powerAdmin, controller.api.back.user.show); // 获取单个用户信息
  router.get('/api/back/user/list', powerAdmin, controller.api.back.user.list); // 获取用户列表
  router.post('/api/back/user/password', powerAdmin, controller.api.back.user.password); // 更改某个用户的密码（登录用户）
  router.post('/api/back/user/create', powerSuper, controller.api.back.user.create); // 创建用户（超级管理员接口）
  router.post('/api/back/user/update', powerSuper, controller.api.back.user.update); // 更改某个用户的信息（超级管理员接口）
  router.post('/api/back/user/delete', powerSuper, controller.api.back.user.delete); // 删除某个用户（超级管理员接口）
}
