'use strict';

const Service = require('egg').Service;
const Db = require('./Db');
const pageModel = require('../model/proto/page');

class PageService extends Service {

  /*
  * 创建自定义页面
  */
  async create(data) {
    const db = new Db(this.ctx.model.Page);
    let newData = db.parseModelman(data, pageModel);
    return db.create(newData);
  }

  /*
  * 更新自定义页面
  */
  async update(query, target) {
    const db = new Db(this.ctx.model.Page);
    return db.update(query, target);
  }

  /**
   * 删除自定义页面
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Page);
    return db.remove(query);
  }

  /**
   * 按照条件查询自定义页面（带分页功能）
   */
  async find(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Page.find(query)
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 查询一个自定义页面
   */
  async findOne(query) {
    return this.ctx.model.Page.findOne(query).exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Page.count(query).exec();
  }

}

module.exports = PageService;
