/** 独立文件 */
module.exports = function(controller) {
  return {
    get: ['/sitemap.txt', controller.sitemap.index], //sitemap.txt
    get: ['/robots.txt', controller.config.robots] //robots.txt
  }
}
