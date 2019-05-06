/** 模型api */
module.exports = function(app) {
  const { router, controller } = app; 
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  router.get('/api/back/model', powerAdmin, controller.api.back.model.index); //获取模型对象
}
