'use strict';

const Controller = require('egg').Controller;
const models = require('../../model/proto/index');

class ModelController extends Controller {

  //获取数据模型
  async index() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }

    let modelName = ctx.query.name;
    if (!modelName) {
      return ctx.helper.throwError(ctx, "参数错误");
    }

    let model = models[modelName];
    if (!model) {
      return ctx.helper.throwError(ctx, "没有找到这个模型");
    }

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        model: model
      }
    };
  }
}

module.exports = ModelController;
