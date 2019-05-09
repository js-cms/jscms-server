'use strict';

const _ = require('lodash');

const Service = require('egg').Service;
const Db = require('./Db');
const cacheModel = require('../model/proto/cache');

class CacheService extends Service {

  /*
   * 创建缓存
   */
  async create(data) {
    const db = new Db(this.ctx.model.Cache);
    let newData = db.parseModelman(data, cacheModel);
    return db.create(newData);
  }

  /*
   * 更新缓存
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Cache);
    return db.update(query, target);
  }

  /**
   * 删除缓存
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Cache);
    return db.remove(query);
  }

  /**
   * 查询缓存
   */
  async find(query) {
    const db = new Db(this.ctx.model.Cache);
    return db.find(query);
  }

  /**
   * 查找一个缓存
   */
  async findOne(query) {
    return this.ctx.model.Cache.findOne(query)
      .exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Cache.count(query).exec();
  }
}

module.exports = CacheService;