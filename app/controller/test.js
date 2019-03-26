'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {

  //获取日志列表
  async index(meta = {
    router: {
      method: 'get',
      path: '/test/test'
    }
  }) {
    const { ctx, service, config } = this;
    ctx.body = "hi";
  }
}

module.exports = TestController;