/** 模型api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.get('/api/model', controller.model.index); //获取模型对象
}
