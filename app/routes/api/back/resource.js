/** 资源api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/back/resource/uploader', controller.api.back.resource.uploader); //资源上传
  router.post('/api/back/resource/create', controller.api.back.resource.create); //资源创建
  router.post('/api/back/resource/delete', controller.api.back.resource.delete); //资源删除
  router.get('/api/back/resource/list', controller.api.back.resource.list); //获取资源列表
}
