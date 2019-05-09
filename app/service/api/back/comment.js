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
   * 更新评论
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Comment);
    return db.update(query, target);
  }

  /**
   * 删除评论
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Comment);
    query.authorAvatar = query.authorAvatar ? query.authorAvatar : '';
    return db.remove(query);
  }

  /**
   * 查询评论（带分页选项）
   */
  async find(query, pageNumber = 0, pageSize = 10) {
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
   * 统计
   */
  async count(query) {
    return this.ctx.model.Comment.count(query).exec();
  }

  /**
   * 模糊搜索接口
   * @param {Object} options
   */
  async searchForApi(options) {
    const db = new Db(this.ctx.model.Comment);
    return db.search(options, commentModel);
  }
}

module.exports = CommentService;