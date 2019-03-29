/** 自定义页面相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/page/create', controller.api.page.create); //新增页面
  router.post('/api/page/delete', controller.api.page.delete); //删除页面
  router.post('/api/page/update', controller.api.page.update); //更新页面
  router.get('/api/page/list', controller.api.page.list); //获取页面列表
  router.get('/api/page', controller.api.page.show); //获取单个页面
}
