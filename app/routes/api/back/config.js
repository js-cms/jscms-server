/** 配置信息api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.get('/api/back/config', powerAdmin, controller.api.back.config.show); //查看某个配置信息
  router.post('/api/back/config', powerSuper, controller.api.back.config.update); //更新某个配置信息
}
