'use strict';

const Controller = require('egg').Controller;
const uuid = require('uuid');

// 定义创建接口的请求参数规则

const _passRule = {
  type: 'password', required: true, max: 16, min: 8
}

const passRule = {
  password: _passRule
}

const userRule = {
  email: { type: 'email', required: true },
  password: _passRule
};

/**
 * 用户相关的api接口
 */
class UserController extends Controller {

  /**
   * @description 获取单个用户的信息（超级管理员接口）
   */
  async show() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    if (!ctx.locals.currentUser.hasPower('super')) {
      return ctx.helper.throwError(ctx, '你没有权限', 403);
    }

    //获取该用户的数据
    const user = await ctx.service.user.findOne({ _id: ctx.query.id });

    if (user) {
      ctx.body = {
        code: 0,
        msg: 'ok',
        data: user
      };
    } else {
      ctx.body = {
        code: 1,
        msg: '没有找到该用户的信息'
      };
    }
  }

  /**
   * @description 获取当前用户的信息（登陆用户接口）
   */
  async self() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const userId = ctx.locals.currentUser.user._id;

    //获取当前用户的数据
    const user = await ctx.service.user.findOne({ _id: userId });

    if (user) {
      ctx.body = {
        code: 0,
        msg: 'ok',
        data: user
      };
    } else {
      ctx.body = {
        code: 1,
        msg: '没有找到该用户的信息'
      };
    }
  }

  /**
   * @description 创建一个用户（超级管理员接口）
   */
  async create() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    if (!ctx.locals.currentUser.hasPower('super')) {
      return ctx.helper.throwError(ctx, '你没有权限', 403);
    }

    const user = ctx.request.body;

    //判断用户是否已经被创建
    const findUsers = await ctx.service.user.getUsersByQuery({
      $or: [{ email: user.email }]
    });
    if (findUsers.length > 0) {
      ctx.status = 422;
      return ctx.helper.throwError(ctx, '用户名或邮箱已被使用。')
    }

    //获取用户总数
    const count = await ctx.service.user.count({});
    if ( !user.nickname ) {
      user.nickname = '会员' + count;
    }

    //没有注册的话就注册该用户
    const createUser = await ctx.service.user.create(user);
    
    //如果用户添加成功
    if (createUser._id) {
      // 设置响应体和状态码
      ctx.body = {
        code: 0,
        msg: '用户创建成功',
      };
    } else {
      return ctx.helper.throwError(ctx, '用户创建失败')
    }
    ctx.status = 201;
  }

  /**
   * @description 更新一个用户的信息（超级管理员接口）
   */
  async update() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    if (!ctx.locals.currentUser.hasPower('super')) {
      return ctx.helper.throwError(ctx, '你没有权限', 403);
    }

    const user = ctx.request.body;
    const userId = user.id;
    delete user.id;

    //如果用户准备修改nickname，判断是否重复
    if (user.nickname) {
      const findUser = await ctx.service.user.getUserByNickname(user.nickname)
      if (findUser && String(findUser._id) !== String(userId)) {
        return ctx.helper.throwError(ctx, '昵称已被人使用');
      }
    }

    let res = await ctx.service.user.update({ _id: userId }, user);
    if (res) {
      ctx.body = {
        code: 0,
        msg: '用户信息更新成功！'
      }
    } else {
      return ctx.helper.throwError(ctx, '用户信息更新失败。');
    }
  }

  /**
   * @description 获取用户列表（管理员接口）
   */
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const listRes = await ctx.service.user.find({});
    if (listRes) {
      ctx.body = {
        code: 0,
        mag: '查询成功',
        data: listRes
      }
    } else {
      return ctx.helper.throwError(ctx, '查询失败');
    }
    ctx.status = 201;
  }

  /**
   * @description 统计用户（管理员接口）
   */
  async count() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const countNum = await ctx.service.user.count({});
    ctx.body = {
      code: 0,
      msg: 'ok',
      data: {
        count: countNum
      }
    };
    ctx.status = 201;
  }

  /**
   * @description 修改密码（普通接口）
   */
  async password() {
    const { ctx, service, config } = this;
    ctx.validate(passRule);
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const password = ctx.request.body.password;
    const userId = ctx.locals.currentUser.user._id;
    let res = await ctx.service.user.update({ _id: userId }, {
      password: this.ctx.helper.bhash(password)
    });
    if (res) {
      ctx.body = {
        code: 0,
        msg: '密码修改成功'
      }
    } else {
      return ctx.helper.throwError(ctx, '密码修改失败');
    }
  }

  /**
   * @description 登陆（普通接口）
   */
  async login() {
    const { ctx, service, config } = this;
    ctx.validate(userRule);
    const _user = ctx.request.body;
    //判断用户是否存在
    const existUser = await ctx.service.user.getUserByMail(_user.email);
    // 用户不存在
    if (!existUser) {
      return ctx.helper.throwError(ctx, '用户不存在');
    }
    // TODO: change to async compare
    const equal = ctx.helper.bcompare(_user.password, existUser.password);
    // 密码不匹配
    if (!equal) {
      return ctx.helper.throwError(ctx, '密码不正确');
    }

    //创建新的token
    let accessToken = uuid.v4();

    let res = await ctx.service.token.getByUserId(existUser._id);
    //更新用户的token，没有则自动创建。
    if (res) { //更新 
      const now = (new Date()).getTime();
      const tomorrow = now + 1000 * 60 * 60 * 24;
      res = await ctx.service.token.updateToken({
        userId: existUser._id
      }, {
          token: accessToken,
          updateTime: now,
          passwExpiry: tomorrow
        });
    } else { //创建
      res = await ctx.service.token.create({
        userId: existUser._id,
        token: accessToken,
      });
    }

    if (!res) {
      return ctx.helper.throwError(ctx, '登陆失败');
    }

    ctx.body = {
      code: 0,
      msg: '登陆成功',
      data: {
        token: accessToken,
        userInfo: existUser
      }
    };
  }

  /**
   * @description 登出（普通接口）
   */
  async logout() {
    const { ctx, service } = this;
    let token = ctx.query.token;
    let userId = ctx.query.userId;
    let removeRes = await service.token.remove({
      token,
      userId
    });
    if (!removeRes) {
      return ctx.helper.throwError(ctx, '登出失败');
    } else {
      ctx.body = {
        code: 0,
        msg: '登出成功'
      };
    }
  }

}

module.exports = UserController;
