/** 标签页 */
module.exports = function(controller) {
  return {
    get: ['/tags/:tagName', controller.main.tags]
  }
}
