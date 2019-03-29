'use strict';

const BaseController = require('./base');

class CategoryController extends BaseController {

  /**
   * 分类页
   */
  async index() {
    await this.loadCommonData();
    await this.handler();
  }

  async handler() {
    
  }

}

module.exports = CategoryController;
