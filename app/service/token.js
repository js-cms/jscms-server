'use strict';

const Service = require('egg').Service;

class TokenService extends Service {

  /*
   * 新建Token
   */
  async create(tokenObj) {
    const Token = new this.ctx.model.Token();
    for (const key in tokenObj) {
      Token[key] = tokenObj[key];
    }
    return Token.save();
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

  /**
   * 通过条件删除
   */
  async remove(query) {
    return this.ctx.model.Token.remove(query).exec();
  }

  /**
   * 统计
   */
  async count() {
    return this.ctx.model.Token.count({}).exec();
  }
}

module.exports = TokenService;