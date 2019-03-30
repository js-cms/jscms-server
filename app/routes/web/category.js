/** 分类页面 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get(/^\/(\w+)-(\d+)\.html$/, controller.web.category.index); //分类页分页路由
  router.get(/^\/(\w+)\.html$/, controller.web.category.index); //分类页控制器
}
