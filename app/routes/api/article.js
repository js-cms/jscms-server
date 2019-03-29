/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/article/like', controller.api.article.like); //文章点赞
  router.post('/api/article/create', controller.api.article.create); //新增文章
  router.post('/api/article/update', controller.api.article.update); //更新文章
  router.post('/api/article/delete', controller.api.article.delete); //删除文章
  router.get('/api/article/list', controller.api.article.list); //获取文章列表
  router.get('/api/article', controller.api.article.show); //获取单篇文章
}
