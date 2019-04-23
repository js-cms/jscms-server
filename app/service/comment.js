'use strict';

const Service = require('egg').Service;
const Db = require('./Db');

class CommentService extends Service {

  /**
   * @description 创建评论
   */
  async create(data) {
    const db = new Db(this.ctx.model.Comment);
    return db.create(data);
  }

  /**
   * @description 更新评论
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Comment);
    return db.update(query, target);
  }

  /**
   * @description 删除评论
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Comment);
    return db.remove(query);
  }

  /**
   * @description 查询评论（带分页选项）
   */
  async find(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Comment.find(query)
      .populate('articleId')
      .populate('commentId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * @description 统计
   */
  async count(query) {
    return this.ctx.model.Comment.count(query).exec();
  }

}

module.exports = CommentService;
