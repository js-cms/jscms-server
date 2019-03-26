/** web网页伪静态入口 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/:routerName', controller.main.index); //伪静态入口
}
