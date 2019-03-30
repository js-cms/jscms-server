/** 搜索页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/s', controller.web.search.index); //搜索页
  router.get('/s/:keyword', controller.web.search.index); //搜索页
}
