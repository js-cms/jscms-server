/** 分类相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/category/create', controller.api.category.create); //新增分类
  router.post('/api/category/delete', controller.api.category.delete); //删除分类
  router.post('/api/category/update', controller.api.category.update); //更新分类
  router.get('/api/category/list', controller.api.category.list); //获取分类列表
  router.get('/api/category', controller.api.category.show); //获取单个文章
}
