'use strict';

const Service = require('egg').Service;
const Db = require('./Db');

class ConfigService extends Service {

  /*
  * 创建配置
  */
  async create(data) {
    const db = new Db(this.ctx.model.Config);
    return db.create(data);
  }

  /*
  * 更新配置
  */
  async update(query, target) {
    const db = new Db(this.ctx.model.Config);
    return db.update(query, target);
  }

  /**
   * 删除配置
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Config);
    return db.remove(query);
  }

  /**
   * 查询配置
   */
  async find(query) {
    const db = new Db(this.ctx.model.Config);
    return db.find(query);
  }

  /**
   * 查找一个配置
   */
  async findOne(query) {
    return this.ctx.model.Config.findOne(query)
      .exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Config.count(query).exec();
  }
}

module.exports = ConfigService;
