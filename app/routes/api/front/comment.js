/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/front/comment/create', controller.api.front.comment.create); //新增评论
}
