/** 独立自定义页面 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/page/:pageAlias', controller.main.page);
}
