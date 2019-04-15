'use strict';

const Controller = require('egg').Controller;

//数据校验函数
const validate = function (object) {
  return {
    code: 0,
    object: object
  };
}

/**
 * 分类相关api
 */
class CategoryController extends Controller {

  //新增分类
  async create() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const validateResult = validate(ctx.request.body);
    //校验失败
    if (validateResult.code === 1) {
      return ctx.helper.throwError(ctx, validateResult.msg, validateResult.code);
    }
    let parameters = validateResult.object;

    let findRes = await service.category.findOne({
      name: parameters.name,
      alias: parameters.alias
    });

    //判断是否存在重复分类
    if (findRes) {
      return ctx.helper.throwError(ctx, '分类已存在');
    }

    //分类创建结果
    const createCatRes = await service.category.create(parameters);

    if (createCatRes._id) {
      ctx.body = {
        code: 0,
        msg: '分类创建完成',
        data: createCatRes
      }
    } else {
      return ctx.helper.throwError(ctx, '分类创建失败');
    }
  }

  //更新分类
  async update() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const id = ctx.request.body._id;
    let info = ctx.request.body;
    delete info._id;
    delete info.createTime;
    delete info.updateTime;

    const updateRes = await service.category.update(id, info);
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

  //删除分类
  async delete() {
    const { ctx, service } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    const deleteRes = await service.category.remove({_id: id});

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '分类删除完成'
      }
    } else {
      return ctx.helper.throwError(ctx, '分类创建失败');
    }
  }

  //获取分类列表
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    //获取分类列表
    const findCategoryRes = await service.category.find({});

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: findCategoryRes
    };
  }

  //获取单个分类信息
  async show() {
    const { ctx, service, config } = this;
    ctx.body = 'hi!';
  }
}

module.exports = CategoryController;
