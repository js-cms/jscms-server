'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const articleModel = require(`${appPath}/model/proto/article`);

class ArticleService extends Service {

  /**
   * 创建文章
   */
  async create(data, isBreak) {
    if (isBreak === true) {
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

  /**
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
   * 查找一篇文章
   */
  async findOne(query) {
    return this.ctx.model.Article.findOne(query)
      .populate('userId')
      .populate('categoryId')
      .exec();
  }

  /**
   * 后台模糊搜索接口
   * @param {Object} options
   */
  async search(options) {
    const db = new Db(this.ctx.model.Article);
    return db.search(options, articleModel);
  }
}

module.exports = ArticleService;