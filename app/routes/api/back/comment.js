/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/back/comment/webcreate', controller.api.back.comment.webcreate); //新增评论（网站前端接口）
  router.post('/api/back/comment/create', controller.api.back.comment.create); //新增评论（管理员接口）
  router.post('/api/back/comment/update', controller.api.back.comment.update); //更新评论
  router.post('/api/back/comment/delete', controller.api.back.comment.delete); //删除评论
  router.get('/api/back/comment/list', controller.api.back.comment.list); //获取评论列表
  router.get('/api/back/comment', controller.api.back.comment.show); //获取单条评论
}
