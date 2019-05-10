'use strict';

const Service = require('egg').Service;

class PageService extends Service {

  /**
   * 通过别名查询一个自定义页面
   */
  async alias(alias) {
    return this.ctx.model.Page.findOne({alias}).exec();
  }
}

module.exports = PageService;