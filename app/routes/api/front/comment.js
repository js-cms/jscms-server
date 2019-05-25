/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/front/comment/config', controller.api.front.comment.conf); // 获取评论配置
  router.get('/api/front/comment/list', controller.api.front.comment.list); // 获取评论列表
  router.get('/api/front/comment/childlist', controller.api.front.comment.childlist); // 获取子评论列表
  router.post('/api/front/comment/create', controller.api.front.comment.create); // 新增评论
}
