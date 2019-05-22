/**
 * 前台API：评论相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const commentModel = require(`${appPath}/model/proto/comment`);

class CommentService extends Service {

  /**
   * 创建评论
   */
  async create(data) {
    const db = new Db(this.ctx.model.Comment);
    let newData = db.parseModelman(data, commentModel);
    return db.create(newData);
  }

  /**
   * 查询评论（带分页选项）
   */
  async list(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Comment.find(query)
      .populate('articleId')
      .populate('userId')
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 查询某篇文章的所有评论
   */
  async articleId(articleId) {
    return this.ctx.model.Comment.find({articleId})
      .populate('articleId')
      .sort({
        'createTime': -1
      })
      .exec();
  }

  /**
   * 统计评论总数
   */
  async count(query) {
    return this.ctx.model.Comment.count(query).exec();
  }
  
}

module.exports = CommentService;