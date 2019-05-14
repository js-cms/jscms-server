/** 最新文章页面 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get(/^\/latest\/(\d+)\.html$/, controller.web.latest.index); //latest级别
}
