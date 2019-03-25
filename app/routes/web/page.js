/** 独立自定义页面 */
module.exports = function(controller) {
  return {
    get: ['/page/:pageAlias', controller.main.page]
  }
}
