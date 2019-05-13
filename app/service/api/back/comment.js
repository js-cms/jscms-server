/**
 * 后台API：评论相关数据服务
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
   * 后台API：模糊搜索接口
   * @param {Object} options
   */
  async search(options) {
    const db = new Db(this.ctx.model.Comment);
    return db.search(options, commentModel);
  }
}

module.exports = CommentService;