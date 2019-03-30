/** 独立自定义页面 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get(/^\/page\/(\w+)\.html$/, controller.web.page.index);
}
