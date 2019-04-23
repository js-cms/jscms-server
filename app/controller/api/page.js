'use strict';

const Controller = require('egg').Controller;

/**
 * 页面相关api
 */
class PageController extends Controller {

  //前端渲染
  async index() {
    const { ctx, service, config } = this;
    ctx.body = 'hi';
  }

  //新增页面
  async create() {
    const { ctx, service, config } = this;

    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    let parameters = ctx.request.body;

    if (!parameters.name || !parameters.alias) {
      return ctx.helper.throwError(ctx, '缺少参数');
    }

    //查找同别名页面
    let findPageRes = await service.page.findOne({
      alias: parameters.alias
    });

    if (findPageRes) {
      return ctx.helper.throwError(ctx, '别名重复');
    }

    //创建页面
    let createPageRes = await service.page.create(parameters);

    if (createPageRes._id) {
      ctx.body = {
        code: 0,
        msg: '页面创建完成',
        data: createPageRes
      }
    } else {
      return ctx.helper.throwError(ctx, '页面创建失败');
    }
  }

  //更新页面
  async update() {
    const { ctx, service, config } = this;

    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    let parameters = ctx.request.body;

    if (!parameters.name || !parameters.alias) {
      return ctx.helper.throwError(ctx, '缺少参数');
    }

    const id = parameters.id;
    let info = parameters;

    delete info.id;
    delete info.createTime;
    delete info.updateTime;

    const updateRes = await service.page.update({_id: id}, info);

    if (updateRes) {
      ctx.body = {
        code: 0,
        msg: '更新页面成功',
        data: updateRes
      };
    } else {
      return ctx.helper.throwError(ctx, '更新失败');
    }
  }

  //删除页面
  async delete() {
    const { ctx, service, config } = this;

    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    const deleteRes = await service.page.remove({_id: id});

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '页面删除完成'
      }
    } else {
      return ctx.helper.throwError(ctx, '页面删除失败');
    }
  }

  //获取页面列表
  async list() {
    const { ctx, service, config } = this;

    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    //获取页面列表
    const findPageRes = await service.page.find({}, pageNumber, pageSize);
    //获取文章总数
    const countPageRes = await service.page.count({});

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        list: findPageRes,
        total: countPageRes
      }
    };
  }

  //获取单个页面信息
  async show() {
    const { ctx, service, config } = this;

    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.query.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    //获取文章
    const findPageRes = await service.page.findOne({ _id: id });

    if (findPageRes) {
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: findPageRes
      };
    } else {
      return ctx.helper.throwError(ctx, '文章查询失败');
    }
  }
}

module.exports = PageController;
