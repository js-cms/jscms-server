/** 用户页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/author/:nickname', controller.main.author);
}
