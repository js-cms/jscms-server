/** 文章相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/front/article/like', controller.api.front.article.like); //文章点赞
}
