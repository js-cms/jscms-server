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

  //初始化配置信息
  async install() {
    const { ctx, service, config } = this;
    if (ctx.app.config.env !== 'local') {
      return ctx.helper.throwError(ctx, '没有操作权限');
    }

    let params = ctx.request.body;

    let findRes = await service.config.findOne({
      name: params.name,
      alias: params.alias
    });

    if (findRes) {
      return ctx.helper.throwError(ctx, params.name + '配置已存在');
    }

    let createRes = await service.config.create(params);

    if (createRes._id) {
      ctx.body = {
        code: 0,
        msg: '安装完成',
        data: createRes
      }
    } else {
      return ctx.helper.throwError(ctx, params.name + '配置插入失败');
    }
  }

  //robots.txt
  async robots() {
    const { ctx, service, config } = this;
    ctx.body = '';
  }

}

module.exports = ConfigController;
