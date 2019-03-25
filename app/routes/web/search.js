/** 搜索页 */
module.exports = function(controller) {
  return {
    get: ['/s', controller.main.search], //搜索页
    get: ['/s/:keyword', controller.main.search] //搜索页别名
  }
}
