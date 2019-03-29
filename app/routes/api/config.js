/** 配置信息api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/config', controller.api.config.show); //查看某个配置信息
  router.post('/api/config', controller.api.config.update); //更新某个配置信息
}
