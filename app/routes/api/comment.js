/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/comment/create', controller.api.comment.create); //新增文章
  router.post('/api/comment/update', controller.api.comment.update); //更新文章
  router.post('/api/comment/delete', controller.api.comment.delete); //删除文章
  router.get('/api/comment/list', controller.api.comment.list); //获取评论列表
  router.get('/api/comment', controller.api.comment.show); //获取单条评论
}
