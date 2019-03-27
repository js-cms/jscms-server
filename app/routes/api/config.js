/** 配置信息api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/config/install', controller.api.config.install); //配置信息安装
  router.get('/api/config', controller.api.config.show); //查看某个配置信息
  router.post('/api/config', controller.api.config.update); //更新某个配置信息
}
