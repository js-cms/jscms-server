/** 评论相关api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  router.post('/api/back/comment/create', powerAdmin, controller.api.back.comment.create); //新增评论
  router.post('/api/back/comment/update', powerAdmin, controller.api.back.comment.update); //更新评论
  router.post('/api/back/comment/delete', powerAdmin, controller.api.back.comment.delete); //删除评论
  router.get('/api/back/comment/list', powerAdmin, controller.api.back.comment.list); //获取评论列表
  router.get('/api/back/comment', powerAdmin, controller.api.back.comment.show); //获取单条评论
}
