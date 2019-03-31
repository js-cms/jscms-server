'use strict';

const Service = require('egg').Service;

class CommentService extends Service {

  /*
   * 新建评论
   */
  async create(CommentObj) {
    const Comment = new this.ctx.model.Comment();
    for (const key in CommentObj) {
      Comment[key] = CommentObj[key];
    }
    return Comment.save();
  }

  /*
   * 根据关键字，获取一组评论
   * Callback:
   * - err, 数据库异常ß
   * - Comments, 评论列表
   * @param {String} query 关键字
   * @param {Object} opt 选项
   * @return {Promise[Comments]} 承载评论列表的 Promise 对象
   */
  async getCommentsByQuery(query, opt) {
    return this.ctx.model.Comment.find(query, '', opt).exec();
  }

  /**
   * 查询评论
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
   * 查询评论
   */
  async findByQuery(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Comment.find(query)
      .populate('articleId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 搜索评论
   */
  async search(query, pageNum = 0, pageSize = 10) {
    return this.ctx.model.Comment.find(query)
      .populate('articleId')
      .populate('commentId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /***
   *  查找最最新的制定数量的评论
   */
  async findByNum(pageSize) {
    let pageNum = 0;
    return this.ctx.model.Comment.find({})
      .populate('questionId')
      .sort({ 'createTime': -1 })
      .skip(pageNum * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 查找一个评论
   */
  async findOne(query) {
    return this.ctx.model.Comment.findOne(query).exec();
  }

  /*
   * 根据评论Id查找评论
   * @param {Object} obj
   */
  async getCommentById(CommentId) {
    return this.ctx.model.Comment.findById(CommentId)
      .populate('questionId')
      .exec();
  }


  /**
   * 更新评论信息
   */
  async update(CommentId, updateInfo) {
    if (!CommentId) {
      return;
    }
    const query = { _id: CommentId };
    const update = updateInfo;
    return this.ctx.model.Comment.update(query, update).exec();
  }

  /**
   * 通过评论Id删除评论
   */
  async remove(CommentId) {
    return this.ctx.model.Comment.findOneAndRemove({
      _id: CommentId
    }).exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Comment.count(query).exec();
  }

}

module.exports = CommentService;
