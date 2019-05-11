/**
 * 前台文章相关服务
 */

'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);

/**
 * 文章处理
 */
const articleHandle = function (data) {
  /**
   * 覆盖原有发布者
   */
  function indepUser(data) {
    if (!data) return;
    const cover = function (article) {
      if (article.isIndepUser === true) {
        article.userId = _.cloneDeep(article.userId);
        article.userId.avatar = article.indepUserAvatar || article.userId.avatar;
        article.userId.nickname = article.indepUserNickname || article.userId.nickname;
        article.userId.about = article.indepUserAbout || article.userId.about;
      }
    }
    if (data.constructor === Array) {
      data.forEach(i => {
        cover(i)
      });
    } else {
      cover(data);
    }
  }
  /**
   * 检测分类
   */
  function checkCategory(data) {
    if (!data) return;
    const cover = function (article) {
      if (!article.categoryId) {
        article.categoryId = {
          id: '',
          alias: '404',
          name: '无分类'
        }
      }
    }
    if (data.constructor === Array) {
      data.forEach(i => {
        cover(i)
      });
    } else {
      cover(data);
    }
  }

  indepUser(data);
  checkCategory(data);
}

class ArticleService extends Service {

  /**
   * 通过numberId查找一篇文章
   */
  async numberId(numberId) {
    let article = await this.ctx.model.Article.findOne({
        numberId
      })
      .populate('userId')
      .populate('categoryId')
      .exec();
    articleHandle(article);
    return article;
  }

  /**
   * 更新文章访问量
   */
  async updateVis(articleId) {
    const db = new Db(this.ctx.model.Article);
    return db.updateOne({
      _id: articleId
    }, {
      $inc: {
        visTotal: 1
      }
    });
  }

  /**
   * 查询符合条件的文章列表，带有分页选项
   */
  async list(query, pageNumber = 0, pageSize = 10) {
    let articles = await this.ctx.model.Article.find(query)
      .populate('userId')
      .populate('categoryId')
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
    articleHandle(articles);
    return articles;
  }

  /**
   * 随机读取文章
   */
  async random(num) {
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
  async visHot(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .sort({
        'visTotal': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 获取按评论量排名的文章
   */
  async commentHot(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .sort({
        'commentTotal': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 根据条件搜索文章
   */
  async search(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Article.find(query)
      .populate('userId')
      .populate('categoryId')
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 网站站内搜索封装
   */
  async websearch(keyword, pageNumber, pageSize) {
    let regKeyword = new RegExp(keyword, 'i'); //不区分大小写
    let whereOr = [];
    let where = {}
    if (keyword) {
      whereOr.push({
        title: {
          $regex: regKeyword
        }
      });
      whereOr.push({
        content: {
          $regex: regKeyword
        }
      });
    }
    if (whereOr.length) {
      where = {
        '$or': whereOr
      }
    }
    let articles = await this.search(where, pageNumber, pageSize);
    let total = await this.count(where);
    articleHandle(articles);
    return {
      articles,
      total
    };
  }

  /**
   * 
   * 查找所有文章
   */
  async all() {
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