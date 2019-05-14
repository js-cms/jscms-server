/** 独立自定义页面 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get(/^\/categories\/(\w+)\.html$/, controller.web.categories.index); //categories级别
}
