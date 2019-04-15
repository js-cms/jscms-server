'use strict';

const Service = require('egg').Service;
const Db = require('./Db');

class ArticleService extends Service {

  /*
   * 创建文章
   */
  async create(data) {
    const db = new Db(this.ctx.model.Article);
    return db.create(data);
  }

  /*
   * 更新文章
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Article);
    return db.update(query, target);
  }

  /**
   * 删除文章
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Article);
    return db.remove(query);
  }

  /**
   * 查询符合条件的文章
   */
  async find(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .populate('userId')
      .populate('categoryId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 随机读取文章
   */
  async findRandom(num) {
    let total = await this.ctx.model.Article.count({}).exec(); //总数
    let promises = [];
    for (let i = 0; i < num; i++) {
      let skip = Math.round(Math.random() * (total - 1));
      let tempArr = await this.ctx.model.Article.find({}).skip(skip).limit(1).exec();
      promises.push(tempArr[0]);
    }
    return promises
  }

  /**
   * 获取按浏览量排名的文章
   */
  async findByHot(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .sort({ 'visNumber': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 获取按评论量排名的文章
   */
  async findByComment(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .sort({ 'commentCount': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 查找一篇文章
   */
  async findOne(query) {
    return this.ctx.model.Article.findOne(query)
      .populate('userId')
      .populate('categoryId')
      .exec();
  }

  /**
   * 查找一篇文章（网站使用）
   */
  async findOneForWeb(query) {
    return this.ctx.model.Article.findOne(query)
      .populate('userId')
      .populate('categoryId')
      .exec();
  }

  /**
   * 根据条件搜索文章
   */
  async search(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .populate('userId')
      .populate('categoryId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }
  
  /**
   * 
   * 查找所有文章
   */
  async findAll() {
    return this.ctx.model.Article.find({}).exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Article.count(query).exec();
  }
}

module.exports = ArticleService;
