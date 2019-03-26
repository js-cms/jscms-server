/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/comment/install', controller.comment.install); //默认评论安装
  router.post('/api/comment/create', controller.comment.create); //新增文章
  router.post('/api/comment/update', controller.comment.update); //更新文章
  router.post('/api/comment/delete', controller.comment.delete); //删除文章
  router.get('/api/comment/list', controller.comment.list); //获取评论列表
  router.get('/api/comment', controller.comment.show); //获取单条评论
}
