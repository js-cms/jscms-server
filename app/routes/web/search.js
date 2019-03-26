/** 搜索页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/s', controller.main.search);//搜索页
  router.get('/s/:keyword', controller.main.search);
}
