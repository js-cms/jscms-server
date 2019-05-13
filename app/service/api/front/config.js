/**
 * 前台API：配置相关数据服务
 */

'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

  /**
   * 根据别名获取配置数据
   */
  async alias(alias) {
    return this.ctx.model.Config.findOne({
      alias
    }).exec();
  }

}

module.exports = ConfigService;