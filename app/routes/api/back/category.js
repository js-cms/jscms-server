/** 分类相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/category/create', powerAdmin, controller.api.back.category.create); //新增分类
  router.post('/api/back/category/delete', powerSuper, controller.api.back.category.delete); //删除分类
  router.post('/api/back/category/update', powerSuper, controller.api.back.category.update); //更新分类
  router.get('/api/back/category/list', powerAdmin, controller.api.back.category.list); //获取分类列表
  router.get('/api/back/category', powerAdmin, controller.api.back.category.show); //获取单个文章
}
