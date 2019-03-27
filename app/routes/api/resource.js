/** 资源api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/resource/uploader', controller.api.resource.uploader); //资源上传
  router.post('/api/resource/create', controller.api.resource.create); //资源创建
  router.post('/api/resource/delete', controller.api.resource.delete); //资源删除
  router.get('/api/resource/list', controller.api.resource.list); //获取资源列表
}
