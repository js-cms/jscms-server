/** web网页伪静态入口 */
module.exports = function(controller) {
  return {
    get: ['/:routerName', controller.main.index], //伪静态入口
  }
}
