/** 独立文件 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/sitemap.txt', controller.web.text.sitemap), //sitemap.txt
  router.get('/robots.txt', controller.web.text.robots) //robots.txt
}
