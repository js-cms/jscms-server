/** 分类相关api */
module.exports = function(controller) {
  return {
    post: ['/api/category/install', controller.category.install], //默认分类安装
    post: ['/api/category/create', controller.category.create], //新增分类
    post: ['/api/category/delete', controller.category.delete], //删除分类
    post: ['/api/category/update', controller.category.update], //更新分类
    get: ['/api/category/list', controller.category.list], //获取分类列表
    get: ['/api/category', controller.category.show] //获取单个文章
  }
}
