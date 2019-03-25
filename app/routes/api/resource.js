/** 资源api */
module.exports = function(controller) {
  return {
    post: ['/api/resource/uploader', controller.resource.uploader], //资源上传
    post: ['/api/resource/create', controller.resource.create], //资源创建
    post: ['/api/resource/delete', controller.resource.delete], //资源删除
    get: ['/api/resource/list', controller.resource.list] //获取资源列表
  }
}
