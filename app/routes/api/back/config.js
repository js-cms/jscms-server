/** 配置信息api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/back/config', controller.api.back.config.show); //查看某个配置信息
  router.post('/api/back/config', controller.api.back.config.update); //更新某个配置信息
}
