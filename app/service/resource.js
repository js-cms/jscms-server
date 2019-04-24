'use strict';

const Service = require('egg').Service;
const Db = require('./Db');
const resourceModel = require('../model/proto/resource');

class ResourceService extends Service {

  /**
   * 创建资源
   */
  async create(data) {
    const db = new Db(this.ctx.model.Resource);
    let newData = db.parseModelman(data, resourceModel);
    return db.create(newData);
  }

  /**
   * 更新资源
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Resource);
    return db.update(query, target);
  }

  /**
   * 删除资源
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Resource);
    return db.remove(query);
  }

  /**
   * 根据条件查询资源（带分页功能）
   */
  async find(query, pageNum = 0, pageSize = 8) {
    return this.ctx.model.Resource.find(query)
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Resource.count(query).exec();
  }
}

module.exports = ResourceService;
