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

  /**
   * 获取列表按照权重排序（web端专用）
   */
  async listForWeb() {
    let list = await this.find({});
    list = list.sort((item1, item2)=>{
      return item1.order - item2.order;
    });
    return list;
  }

  /**
   * 解析分类名称（活动控制器使用）
   */
  async parseNameForArticle(params) {
    if (params.categoryName) {
      let findCatRes = await this.ctx.model.Category.findOne({
        name: params.categoryName
      });
      params.categoryId = findCatRes._id;
      delete params.categoryName;
    }
  }

  /**
   * 让某个分类增加文章数量（活动控制器使用）
   */
  async addNumForArticle(params) {
    return this.update({ _id: params.categoryId }, {
      $inc: { articleTotal: Number(1) }
    });
  }

}

module.exports = CategoryService;
