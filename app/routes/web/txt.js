/** 独立文件 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/sitemap.txt', controller.sitemap.index), //sitemap.txt
  router.get('/robots.txt', controller.config.robots) //robots.txt
}
