/** 标签页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/tags/:tagName', controller.main.tags);
}
