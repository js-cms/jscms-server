/** 文章页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get(/^\/(\d+)\.html$/, controller.web.article.index); //
}
