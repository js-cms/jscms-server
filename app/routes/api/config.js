/** 配置信息api */
module.exports = function(controller) {
  return {
    post: ['/api/config/install', controller.config.install], //配置信息安装
    get: ['/api/config', controller.config.show], //查看某个配置信息
    post: ['/api/config', controller.config.update], //更新某个配置信息
  }
}
