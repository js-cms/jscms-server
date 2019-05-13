/**
 * 后台API：用户相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const userModel = require(`${appPath}/model/proto/user`);

class UserService extends Service {

  /**
   * 创建用户
   */
  async create(data) {
    data.password = this.ctx.helper.bhash(data.password);
    const db = new Db(this.ctx.model.User);
    let newData = db.parseModelman(data, userModel);
    return db.create(newData);
  }

  /**
   * 查询用户
   */
  async find(query) {
    const db = new Db(this.ctx.model.User);
    return db.find(query);
  }

  /**
   * 更新用户
   */
  async remove(query) {
    const db = new Db(this.ctx.model.User);
    return db.remove(query);
  }

  /**
   * 更新用户
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.User);
    return db.update(query, target);
  }

  /**
   * 查找一名用户
   */
  async findOne(query) {
    return this.ctx.model.User.findOne(query).exec();
  }

  /**
   * 根据关键字，获取一组用户
   * Callback:
   * - err, 数据库异常
   * - users, 用户列表
   * @param {Object} query 关键字
   * @param {Object} opt 选项
   * @return {Promise} 承载用户列表的 Promise 对象
   */
  async getUsersByQuery(query = {}, opt = {}) {
    return this.ctx.model.User.find(query, '', opt).exec();
  }

  /**
   * 根据邮箱，查找用户
   * @param {String} email 邮箱地址
   * @return {Promise} 承载用户的 Promise 对象
   */
  async getUserByMail(email) {
    return this.ctx.model.User.findOne({
      email
    }).exec();
  }

  /**
   * 根据昵称，查找用户
   * @param {String} nickname 昵称
   * @return {Promise} 承载用户的 Promise 对象
   */
  async getUserByNickname(nickname) {
    return this.ctx.model.User.findOne({
      nickname: nickname
    }).exec();
  }

  /**
   * 更新用户token
   * @param {String} userId
   */
  async updateToken(userId, token) {
    const query = {
      _id: userId
    };
    const update = {
      accessToken: token
    };
    return this.ctx.model.User.findByIdAndUpdate(query, update).exec();
  }

  /**
   * 统计
   */
  async count(query = {}) {
    return this.ctx.model.User.count(query).exec();
  }
}

module.exports = UserService;