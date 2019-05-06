/** 资源api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  router.post('/api/back/resource/uploader', powerAdmin, controller.api.back.resource.uploader); //资源上传
  router.post('/api/back/resource/create', powerAdmin, controller.api.back.resource.create); //资源创建
  router.post('/api/back/resource/delete', powerSuper, controller.api.back.resource.delete); //资源删除
  router.get('/api/back/resource/list', powerAdmin, controller.api.back.resource.list); //获取资源列表
}
