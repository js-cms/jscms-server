/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/article/create', powerAdmin, controller.api.back.article.create); //新增文章
  router.post('/api/back/article/update', powerSuper, controller.api.back.article.update); //更新文章
  router.post('/api/back/article/delete', powerSuper, controller.api.back.article.delete); //删除文章
  router.get('/api/back/article/list', powerAdmin, controller.api.back.article.list); //获取文章列表
  router.get('/api/back/article', powerAdmin, controller.api.back.article.show); //获取单篇文章
}
