/** 自定义页面相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/page/create', powerAdmin, controller.api.back.page.create); //新增页面
  router.post('/api/back/page/delete', powerSuper, controller.api.back.page.delete); //删除页面
  router.post('/api/back/page/update', powerSuper, controller.api.back.page.update); //更新页面
  router.get('/api/back/page/list', powerAdmin, controller.api.back.page.list); //获取页面列表
  router.get('/api/back/page', powerAdmin, controller.api.back.page.show); //获取单个页面
}
