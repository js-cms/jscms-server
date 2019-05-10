'use strict';

const Service = require('egg').Service;

class CommentService extends Service {

  /**
   * 查询评论（带分页选项）
   */
  async list(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Comment.find(query)
      .populate('articleId')
      .populate('commentId')
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
      .populate('commentId')
      .sort({
        'createTime': -1
      })
      .exec();
  }
  
}

module.exports = CommentService;