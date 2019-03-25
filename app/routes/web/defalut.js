/** 首页 */
module.exports = function(controller) {
  return {
    redirect: ['/index.php', '/index.html', 302], //重定向到首页
    redirect: ['/index.asp', '/index.html', 302], //重定向到首页
    redirect: ['/index.jsp', '/index.html', 302], //重定向到首页
    get: [ '/', controller.main.index] //重定向到首页
  }
}
