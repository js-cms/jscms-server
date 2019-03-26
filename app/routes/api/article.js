/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/article/install', controller.article.install); //默认文章安装
  router.post('/api/article/like', controller.article.like); //文章点赞
  router.post('/api/article/create', controller.article.create); //新增文章
  router.post('/api/article/update', controller.article.update); //更新文章
  router.post('/api/article/delete', controller.article.delete); //删除文章
  router.get('/api/article/list', controller.article.list); //获取文章列表
  router.get('/api/article', controller.article.show); //获取单篇文章
}
