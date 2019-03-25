/** 评论相关api */
module.exports = function(controller) {
  return {
    post: ['/api/comment/install', controller.comment.install], //默认评论安装
    post: ['/api/comment/create', controller.comment.create], //新增文章
    post: ['/api/comment/update', controller.comment.update], //更新文章
    post: ['/api/comment/delete', controller.comment.delete], //删除文章
    get: ['/api/comment/list', controller.comment.list], //获取评论列表
    get: ['/api/comment', controller.comment.show] //获取单条评论
  }
}
