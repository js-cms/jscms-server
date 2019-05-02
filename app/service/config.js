'use strict';

const _ = require('lodash');

const Service = require('egg').Service;
const Db = require('./Db');
const configModel = require('../model/proto/config');

class ConfigService extends Service {

  /*
  * 创建配置
  */
  async create(data) {
    const db = new Db(this.ctx.model.Config);
    let newData = db.parseModelman(data, configModel);
    return db.create(newData);
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

  /**
   * numberId自增（活动控制器使用）
   */
  async numberId(params) {
    let findConfig = await this.ctx.model.Config.findOne({ alias: 'articleCount' });
    let numberId = Number(findConfig.info.num) + 1;
    await this.update({ _id: findConfig._id }, {
      info: { num: numberId }
    });
    params.numberId = numberId;
  }

  /**
   * 更新标签信息（活动控制器使用）
   */
  async updateTagsForArticle(params) {
    if (params.keywords && params.keywords.length) {
      let findTagsRes = await this.ctx.model.Config.findOne({ alias: 'tags' });
      let newTags = _.uniq([...params.keywords, ...findTagsRes.info]);
      return this.update({ _id: findTagsRes._id }, {
        info: newTags
      });
    }
  }
}

module.exports = ConfigService;
