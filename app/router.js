'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const {
    router,
    controller
  } = app;

  //首页路由
  router.redirect('/index.php', '/index.html', 302);
  router.redirect('/index.asp', '/index.html', 302);
  router.redirect('/index.jsp', '/index.html', 302);

  //sitemap.txt
  router.get('/sitemap.txt', controller.sitemap.index); //sitemap
  //robots.txt
  router.get('/robots.txt', controller.config.robots); //sitemap
  
  router.get('/s', controller.main.search); // 搜索页面
  router.get('/', controller.main.index); //首页
  router.get('/:routerName', controller.main.index); //伪静态入口
  router.get('/tags/:tagName', controller.main.tags); //通过标签/关键字查找文章列表
  router.get('/author/:nickname', controller.main.author); // 用户页面
  router.get('/page/:pageAlias', controller.main.page); // 页面路由
  router.get('/s/:keyword', controller.main.search); // 搜索页面

  //资源api
  router.post('/api/resource/uploader', controller.resource.uploader); //资源上传
  router.post('/api/resource/create', controller.resource.create); //资源创建
  router.get('/api/resource/list', controller.resource.list); //获取资源列表
  router.post('/api/resource/delete', controller.resource.delete); //资源删除

  //站点配置api
  router.post('/api/config/install', controller.config.install); //配置信息安装
  router.get('/api/config', controller.config.show); //查看某个配置信息
  router.post('/api/config', controller.config.update); //更新某个配置信息

  //用户相关api
  router.post('/api/user/super', controller.user.super); //创建超级管理员
  router.post('/api/login', controller.user.login); //用户登陆

  //自定义页面相关api
  router.post('/api/page/install', controller.page.install); //默认页面安装
  router.post('/api/page/create', controller.page.create); //新增页面
  router.post('/api/page/delete', controller.page.delete); //删除页面
  router.post('/api/page/update', controller.page.update); //更新页面
  router.get('/api/page/list', controller.page.list); //获取页面列表
  router.get('/api/page', controller.page.show); //获取单个页面

  //分类相关api
  router.post('/api/category/install', controller.category.install); //默认分类安装
  router.post('/api/category/create', controller.category.create); //新增分类
  router.post('/api/category/delete', controller.category.delete); //删除分类
  router.post('/api/category/update', controller.category.update); //更新分类
  router.get('/api/category/list', controller.category.list); //获取分类列表
  router.get('/api/category', controller.category.show); //获取单个文章

  //文章相关api
  router.post('/api/article/install', controller.article.install); //默认文章安装
  router.post('/api/article/like', controller.article.like); //文章点赞
  router.post('/api/article/create', controller.article.create); //新增文章
  router.post('/api/article/update', controller.article.update); //更新文章
  router.post('/api/article/delete', controller.article.delete); //删除文章
  router.get('/api/article/list', controller.article.list); //获取文章列表
  router.get('/api/article', controller.article.show); //获取单篇文章

  //评论相关api
  router.post('/api/comment/install', controller.comment.install); //默认评论安装
  router.post('/api/comment/create', controller.comment.create); //新增文章
  router.post('/api/comment/update', controller.comment.update); //更新文章
  router.post('/api/comment/delete', controller.comment.delete); //删除文章
  router.get('/api/comment/list', controller.comment.list); //获取评论列表
  router.get('/api/comment', controller.comment.show); //获取单条评论

  //搜索记录api
  router.post('/api/log/delete', controller.log.delete); //删除搜索记录
  router.get('/api/log/list', controller.log.list); //获取搜索记录列表

  //模型api
  router.get('/api/model', controller.model.index); //获取模型对象
};
