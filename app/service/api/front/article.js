'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);

class ArticleService extends Service {

  /**
   * 查找一篇文章
   */
  async articleId(articleId) {
    return this.ctx.model.Article.findOne({ _id: articleId }).exec();
  }

  /**
   * 增加文章的点赞数
   */
  async updateLike(articleId) {
    const db = new Db(this.ctx.model.Article);
    return db.updateOne({
      _id: articleId
    }, {
      $inc: {
        likeTotal: 1
      }
    });
  }

  /**
   * 增加文章的评论数
   */
  async updateComment(articleId) {
    const db = new Db(this.ctx.model.Article);
    return db.updateOne({
      _id: articleId
    }, {
      $inc: {
        commentTotal: 1
      }
    });
  }
  
}

module.exports = ArticleService;