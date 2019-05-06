/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/back/article/like', controller.api.back.article.like); //文章点赞
  router.post('/api/back/article/create', controller.api.back.article.create); //新增文章
  router.post('/api/back/article/update', controller.api.back.article.update); //更新文章
  router.post('/api/back/article/delete', controller.api.back.article.delete); //删除文章
  router.get('/api/back/article/list', controller.api.back.article.list); //获取文章列表
  router.get('/api/back/article', controller.api.back.article.show); //获取单篇文章
}
