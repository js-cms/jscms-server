/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/front/comment/list', controller.api.front.comment.list); // 评论列表
  router.post('/api/front/comment/create', controller.api.front.comment.create); // 新增评论
}
