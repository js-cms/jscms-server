/** 资源api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/resource/uploader', controller.resource.uploader); //资源上传
  router.post('/api/resource/create', controller.resource.create); //资源创建
  router.post('/api/resource/delete', controller.resource.delete); //资源删除
  router.get('/api/resource/list', controller.resource.list); //获取资源列表
}
