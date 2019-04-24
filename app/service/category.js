'use strict';

const Service = require('egg').Service;
const Db = require('./Db');
const categoryModel = require('../model/proto/category');

class CategoryService extends Service {

  /*
  * 创建分类
  */
  async create(data) {
    const db = new Db(this.ctx.model.Category);
    let newData = db.parseModelman(data, categoryModel);
    return db.create(newData);
  }

  /*
   * 更新分类
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Category);
    return db.update(query, target);
  }

  /**
   * 删除分类
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Category);
    return db.remove(query);
  }

  /**
   * 查询分类
   */
  async find(query) {
    const db = new Db(this.ctx.model.Category);
    return db.find(query);
  }

  /**
   * 查询一个分类
   */
  async findOne(query) {
    return this.ctx.model.Category.findOne(query).exec();
  }

  /**
   * 统计
   */
  async count() {
    return this.ctx.model.Category.count({}).exec(); 
  }

}

module.exports = CategoryService;
