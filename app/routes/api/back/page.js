/** 自定义页面相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/back/page/create', controller.api.back.page.create); //新增页面
  router.post('/api/back/page/delete', controller.api.back.page.delete); //删除页面
  router.post('/api/back/page/update', controller.api.back.page.update); //更新页面
  router.get('/api/back/page/list', controller.api.back.page.list); //获取页面列表
  router.get('/api/back/page', controller.api.back.page.show); //获取单个页面
}
