/**
 * 后台API：用户token相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const tokenModel = require(`${appPath}/model/proto/token`);

class TokenService extends Service {

  /**
   * 创建token
   */
  async create(data) {
    const db = new Db(this.ctx.model.Token);
    let newData = db.parseModelman(data, tokenModel);
    return db.create(newData);
  }

  /**
   * 删除token
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Token);
    return db.remove(query);
  }

  /**
   * 通过用户Id获取用户的Token
   * @param {String} userId 
   */
  async getByUserId(userId) {
    return this.ctx.model.Token.findOne({
      userId
    }).exec();
  }

  /**
   * 通过用户Id获取用户的Token
   * @param {Object} obj 
   */
  async getTokenByToken(obj) {
    return this.ctx.model.Token.findOne({
      token: obj.token
    }).exec();
  }

  /**
   * 通过userId更新用户的token
   * @param {Object} obj
   */
  async updateToken(query, updateInfo) {
    return this.ctx.model.Token.updateOne(query, updateInfo, {
      upsert: true,
      setDefaultsOnInsert: true
    }).exec();
  }

  /**
   * 删除token
   */
  async removeByToken(token) {
    return this.ctx.model.Token.remove({
      token: token
    }).exec();
  }

}

module.exports = TokenService;