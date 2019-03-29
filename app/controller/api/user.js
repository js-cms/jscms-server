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

const error = function (ctx, msg) {
  ctx.body = {
    code: 1,
    msg: msg,
  };
  return false;
}

class UserController extends Controller {

  async index() {
    this.ctx.body = "hi, imooyo!";
  }

  async show() {
    const ctx = this.ctx;
    //获取该用户的数据
    const users = await ctx.service.user.getUserById(ctx.params.id);

    const usersInfo = ctx.helper.filterFields([
      'email',
      'nickname',
      'url',
      'location',
      'signature',
      'avatar',
      'score',
      'createTime'
    ], users);

    ctx.body = usersInfo;
  }

  async self() {
    const ctx = this.ctx;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }
    const userId = ctx.locals.currentUser.user._id;

    //获取当前用户的数据
    const users = await ctx.service.user.getUserById(userId);

    const usersInfo = ctx.helper.filterFields([
      'email',
      'nickname',
      'url',
      'location',
      'signature',
      'avatar',
      'score',
      'createTime'
    ], users);

    ctx.body = usersInfo;
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(userRule);
    const _user = ctx.request.body;

    //判断用户是否已经注册
    const users = await ctx.service.user.getUsersByQuery({
      $or: [{ email: _user.email }]
    }, {});
    if (users.length > 0) {
      ctx.status = 422;
      return ctx.helper.throwError(ctx, "用户名或邮箱已被使用。")
    }

    const userInfo = ctx.helper.filterFields(
      [
        'email',
        'password'
      ], _user);

    //获取用户总数
    const count = await ctx.service.user.count();
    userInfo.nickname = "会员" + count;

    //没有注册的话就注册该用户
    const user = await ctx.service.user.create(userInfo);
    //如果用户添加成功
    if (user._id) {
      // 设置响应体和状态码
      ctx.body = {
        code: 0,
        msg: 'ok',
      };
    } else {
      return ctx.helper.throwError(ctx, "用户注册失败！")
    }
    ctx.status = 201;
  }

  async updateInfo() {
    const ctx = this.ctx;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }
    const _user = ctx.request.body;
    const userId = ctx.locals.currentUser.user._id;
    const updateInfo = ctx.helper.filterFields(['nickname',
      'url',
      'location',
      'signature',
      'avatar'], _user);

    //如果用户准备修改nickname，判断是否重复
    if (updateInfo.nickname) {
      const nicknameUser = await ctx.service.user.getUserByNickname(updateInfo.nickname)
      if (nicknameUser) {
        return ctx.helper.throwError(ctx, "昵称已被人使用");
      }
    }

    let res = await ctx.service.user.update(userId, updateInfo);
    if (res) {
      ctx.body = {
        code: 0,
        msg: "用户信息更新成功！"
      }
    } else {
      return ctx.helper.throwError(ctx, "用户信息更新失败。");
    }
  }

  async changePass() {
    const ctx = this.ctx;
    ctx.validate(passRule);
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }
    const password = ctx.request.body.password;
    const userId = ctx.locals.currentUser.user._id;
    let res = await ctx.service.user.update(userId, {
      password: this.ctx.helper.bhash(password)
    });
    if (res) {
      ctx.body = {
        code: 0,
        msg: "密码修改成功"
      }
    } else {
      return ctx.helper.throwError(ctx, "密码修改失败");
    }
  }

  /*
   * 登陆
   */
  async login() {
    const { ctx, service, config } = this;
    ctx.validate(userRule);
    const _user = ctx.request.body;
    //判断用户是否存在
    const existUser = await ctx.service.user.getUserByMail(_user.email);
    // 用户不存在
    if (!existUser) {
      return ctx.helper.throwError(ctx, "用户不存在");
    }
    // TODO: change to async compare
    const equal = ctx.helper.bcompare(_user.password, existUser.password);
    // 密码不匹配
    if (!equal) {
      return ctx.helper.throwError(ctx, "密码不正确");
    }

    //创建token
    let accessToken = uuid.v4();

    let res = await ctx.service.token.getByUserId(existUser._id);
    //更新用户的token，没有则自动创建。
    if (res) { //更新
      res = await ctx.service.token.updateToken({
        userId: existUser._id,
        token: accessToken
      });
    } else { //创建
      res = await ctx.service.token.create({
        userId: existUser._id,
        token: accessToken,
      });
    }

    if (!res) {
      return ctx.helper.throwError(ctx, "登陆失败");
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

  /*
   * 登出
   */
  async logout() {
    const { ctx, service, config } = this;
    ctx.body = "hi";
  }

  //用户列表
  async list() {
    const ctx = this.ctx;
    const listRes = await ctx.service.user.find({});
    if (listRes) {
      ctx.body = {
        code: 0,
        mag: '查询成功',
        data: listRes
      }
    } else {
      return ctx.helper.throwError(ctx, "查询失败");
    }
    ctx.status = 201;
  }

  /**
   * 统计
   */
  async count() {
    const ctx = this.ctx;
    const countNum = await ctx.service.user.count();
    ctx.body = {
      code: 0,
      msg: 'ok',
      data: {
        count: countNum
      }
    };
    ctx.status = 201;
  }
}

module.exports = UserController;
