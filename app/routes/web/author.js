/** 用户页 */
module.exports = function(controller) {
  return {
    get: ['/author/:nickname', controller.main.author]
  }
}
