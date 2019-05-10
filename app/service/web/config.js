'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

  /**
   * 更新配置
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Config);
    return db.update(query, target);
  }

  /**
   * 根据别名获取配置数据
   */
  async alias(alias) {
    return this.ctx.model.Config.findOne({
      alias
    }).exec();
  }

  /**
   * 获取全部的标签数据
   */
  async tags() {
    return this.ctx.model.Config.findOne({
      'alias': 'tags'
    }).exec();
  }

}

module.exports = ConfigService;