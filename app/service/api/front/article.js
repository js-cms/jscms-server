/**
 * 前台API：文章相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);

class ArticleService extends Service {

  /**
   * 通过文章id查找一篇文章
   */
  async articleId(articleId) {
    return this.ctx.model.Article.findOne({ _id: articleId }).exec();
  }

  /**
   * 通过文章numberId查找一篇文章
   */
  async numberId(numberId) {
    return this.ctx.model.Article.findOne({numberId}).exec();
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