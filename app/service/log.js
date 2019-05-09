'use strict';

const Service = require('egg').Service;
const Db = require('./Db');
const logModel = require('../model/proto/log');

class LogService extends Service {

  /**
   * 创建日志
   */
  async create(data) {
    const db = new Db(this.ctx.model.Log);
    let newData = db.parseModelman(data, logModel);
    return db.create(newData);
  }

  /**
   * 更新日志
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Log);
    return db.update(query, target);
  }

  /**
   * 删除日志
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Log);
    return db.remove(query);
  }

  /**
   * 查询日志（带分页功能）
   */
  async find(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Log.find(query)
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Log.count(query).exec();
  }


  /**
   * 查找全部
   */
  async findAll(query) {
    return this.ctx.model.Log.find(query).exec();
  }
}

module.exports = LogService;