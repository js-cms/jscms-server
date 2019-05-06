/** 搜索记录api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/log/delete', powerSuper, controller.api.back.log.delete); //删除搜索记录
  router.get('/api/back/log/list', powerAdmin, controller.api.back.log.list); //获取搜索记录列表
}
