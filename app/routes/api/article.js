/** 文章相关api */
module.exports = function(controller) {
  return {
    post: ['/api/article/install', controller.article.install], //默认文章安装
    post: ['/api/article/like', controller.article.like], //文章点赞
    post: ['/api/article/create', controller.article.create], //新增文章
    post: ['/api/article/update', controller.article.update], //更新文章
    post: ['/api/article/delete', controller.article.delete], //删除文章
    get: ['/api/article/list', controller.article.list], //获取文章列表
    get: ['/api/article', controller.article.show] //获取单篇文章
  }
}
