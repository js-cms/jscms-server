/** 分类相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/back/category/create', controller.api.back.category.create); //新增分类
  router.post('/api/back/category/delete', controller.api.back.category.delete); //删除分类
  router.post('/api/back/category/update', controller.api.back.category.update); //更新分类
  router.get('/api/back/category/list', controller.api.back.category.list); //获取分类列表
  router.get('/api/back/category', controller.api.back.category.show); //获取单个文章
}
