'use strict';

const _ = require('lodash');

const Service = require('egg').Service;
const Db = require('./Db');
const articleModel = require('../model/proto/article');

class ArticleService extends Service {

  /**
   * 覆盖原有发布者
   */
  indepUser(data) {
    const cover = function (article) {
      if (article.isIndepUser === true) {
        article.userId = _.cloneDeep(article.userId);
        article.userId.avatar = article.indepUserAvatar || article.userId.avatar;
        article.userId.nickname = article.indepUserNickname || article.userId.nickname;
        article.userId.about = article.indepUserAbout || article.userId.about;
      }
    }
    if (data.constructor === Array) {
      data.forEach(i => {cover(i)});
    } else {
      cover(data);
    }
  }

  /*
   * 创建文章
   */
  async create(data, isBreak) {
    if ( isBreak === true ) {
      const db = new Db(this.ctx.model.Article);
      let newData = db.parseModelman(data.params, articleModel);
      let createRes = db.create(newData);
      if (!createRes) {
        data.throwError('文章创建失败');
      }
    } else {
      const db = new Db(this.ctx.model.Article);
      let newData = db.parseModelman(data, articleModel);
      return db.create(newData);
    }
  }

  /*
   * 更新文章
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Article);
    return db.update(query, target);
  }

  /*
   * 更新单个文章
   */
  async updateOne(query, target) {
    return this.ctx.model.Article.updateOne(query, target).exec();;
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
    let articles = await this.ctx.model.Article.find(query)
      .populate('userId')
      .populate('categoryId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
    this.indepUser(articles);
    return articles;
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
      .sort({ 'visTotal': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 获取按评论量排名的文章
   */
  async findByComment(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .sort({ 'commentTotal': -1 })
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
    let article = await this.ctx.model.Article.findOne(query)
      .populate('userId')
      .populate('categoryId')
      .exec();
    this.indepUser(article);
    return article;
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
   * @description 模糊搜索接口
   * @param {Object} options
   */
  async searchForApi(options) {
    const db = new Db(this.ctx.model.Article);
    return db.search(options, articleModel);
  }

  /**
   * 网站站内搜索封装
   */
  async searchForWeb(keyword, pageNumber, pageSize) {
    let regKeyword = new RegExp(keyword, 'i'); //不区分大小写
    let whereOr = [];
    let where = {}
    if (keyword) {
      whereOr.push({
        title: { $regex: regKeyword }
      });
      whereOr.push({
        content: { $regex: regKeyword }
      });
    }
    if (whereOr.length) {
      where = {
        '$or': whereOr
      }
    }
    let articles = await this.search(where, pageNumber, pageSize);
    let total = await this.count(where);
    this.indepUser(articles);
    return { articles, total };
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
