/** 首页 */
module.exports = function(app) {
  const { router, controller } = app;
  router.redirect('/index.php', '/index.html', 302); //重定向到首页
  router.redirect('/index.asp', '/index.html', 302); //重定向到首页
  router.redirect('/index.jsp', '/index.html', 302); //重定向到首页
  router.get('/', controller.main.index); //重定向到首页
}
