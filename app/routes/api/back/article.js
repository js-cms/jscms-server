/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});

  // 文章相关
  router.post('/api/back/article/create', powerAdmin, controller.api.back.article.create); // 新增文章
  router.post('/api/back/article/update', powerSuper, controller.api.back.article.update); // 更新文章
  router.post('/api/back/article/fastUpdate', powerSuper, controller.api.back.article.fastUpdate); // 更新文章
  router.post('/api/back/article/delete', powerSuper, controller.api.back.article.delete); // 删除文章
  router.get('/api/back/article/list', powerAdmin, controller.api.back.article.list); // 获取文章列表
  router.get('/api/back/article', powerAdmin, controller.api.back.article.show); // 获取单篇文章

  // 文章草稿相关
  router.get('/api/back/article/draft/create', powerAdmin, controller.api.back.articleDraft.create); // 创建一篇文章草稿
  router.get('/api/back/article/draft/update', powerAdmin, controller.api.back.articleDraft.update); // 更新一篇文章草稿
  router.get('/api/back/article/draft/delete', powerAdmin, controller.api.back.articleDraft.delete); // 删除一篇文章草稿
  router.get('/api/back/article/draft/list', powerAdmin, controller.api.back.articleDraft.list); // 获取文章草稿列表
}
