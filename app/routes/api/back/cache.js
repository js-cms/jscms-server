/** 硬盘缓存api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({ powers: ['admin'] }); 
  router.get('/api/back/cache', powerAdmin, controller.api.back.config.show); //根据id获取某条缓存信息
}
