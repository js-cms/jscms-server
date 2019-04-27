'use strict';

const Controller = require('egg').Controller;

/**
 * 分类相关api
 */
class ConfigController extends Controller {

  //获取配置信息
  async show() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const userId = ctx.locals.currentUser.user._id;
    const alias = ctx.query.alias;
    const findRes = await service.config.findOne({ 'alias': alias });

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: findRes
    };
  }

  //更新配置信息
  async update() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const info = ctx.request.body.info;
    const id = ctx.request.body._id;
    const updateRes = await service.config.update({
      _id: id 
    }, {
      info: info
    });
    if (updateRes) {
      ctx.body = {
        code: 0,
        msg: '更新成功',
        data: updateRes
      };
    } else {
      return ctx.helper.throwError(ctx, '更新失败');
    }
  }
}

module.exports = ConfigController;
