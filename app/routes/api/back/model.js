/** 模型api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.get('/api/back/model', controller.api.back.model.index); //获取模型对象
}
