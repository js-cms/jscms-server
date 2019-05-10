'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  /**
   * 通过nickname查找一名用户
   */
  async nickname(nickname) {
    return this.ctx.model.User.findOne({nickname}).exec();
  }

}

module.exports = UserService;