/** 自定义页面相关api */
module.exports = function(controller) {
  return {
    post: ['/api/page/install', controller.page.install], //默认页面安装
    post: ['/api/page/create', controller.page.create], //新增页面
    post: ['/api/page/delete', controller.page.delete], //删除页面
    post: ['/api/page/update', controller.page.update], //更新页面
    get: ['/api/page/list', controller.page.list], //获取页面列表
    get: ['/api/page', controller.page.show] //获取单个页面
  }
}
