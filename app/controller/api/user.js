'use strict';

const uuid = require('uuid');

const BaseController = require('./base');
let user = require('../../model/proto/user');

/**
 * 用户相关的api接口
 */
class UserController extends BaseController {

  /**
   * @description 获取单个用户的信息（超级管理员接口）
   */
  async show() {
    const { ctx } = this;
    this.decorator({
      powers: ['super'],
      login: true,
      get: {
        id: { n: '用户id', type: 'ObjectId', f: true, r: true }
      }
    });

    //获取该用户的数据
    const user = await ctx.service.user.findOne({ _id: this.params.id });

    if (user) {
      this.throwCorrect(user);
    } else {
      this.throwError('没有找到该用户的信息');
    }
  }

  /**
   * @description 获取当前用户的信息（登陆用户接口）
   */
  async self() {
    const { ctx } = this;
    this.decorator({
      login: true
    });

    //获取当前用户的数据
    const findUser = await ctx.service.user.findOne({ _id: this.userId });

    if (findUser) {
      this.throwCorrect(findUser);
    } else {
      this.throwError('没有找到该用户的信息');
    }
  }

  /**
   * @description 创建一个用户（超级管理员接口）
   */
  async create() {
    const { ctx } = this;
    this.decorator({
      powers: ['super'],
      login: true,
      post: user
    });

    //判断用户是否已经被创建
    const findUsers = await ctx.service.user.getUsersByQuery({
      $or: [{ email: this.params.email }]
    });
    if (findUsers.length > 0) {
      this.throwError('用户名或邮箱已被使用。')
    }

    //获取用户总数
    const count = await ctx.service.user.count({});
    if (!this.params.nickname) {
      this.params.nickname = '会员' + count;
    }

    //没有注册的话就注册该用户
    const createUser = await ctx.service.user.create(this.params);

    //如果用户添加成功
    if (createUser._id) {
      this.throwCorrect({}, '用户创建成功');
    } else {
      this.throwError('用户创建失败')
    }
  }

  /**
    * @description 删除某个用户（超级管理员接口）
    */
  async delete() {
    const { service } = this;
    this.decorator({
      powers: ['super'],
      login: true,
      get: {
        id: { n: '用户id', type: 'ObjectId', f: true, r: true }
      }
    });

    const deleteRes = await service.log.remove({ _id: this.params.id });

    if (deleteRes) {
      this.throwCorrect({}, '删除用户成功');
    } else {
      this.throwError('删除用户失败');
    }
  }

  /**
   * @description 更新一个用户的信息（超级管理员接口）
   */
  async update() {
    const { service } = this;
    user.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      powers: ['super'],
      login: true,
      post: user
    });

    //如果用户准备修改nickname，判断是否重复
    if (user.nickname) {
      const findUser = await service.user.getUserByNickname(this.params.nickname)
      if (findUser && String(findUser._id) !== String(this.params.id)) {
        this.throwError('昵称已被人使用');
      }
    }

    //更新用户信息
    let updateRes = await service.user.update({ _id: this.params.id }, this.params);

    if (updateRes) {
      this.throwCorrect({}, '用户信息更新成功');
    } else {
      this.throwError('用户信息更新失败。');
    }
  }

  /**
   * @description 更新当前登陆用户的信息（管理员接口）
   */
  async updateme() {
    const { service } = this;
    delete user.password;
    this.decorator({
      login: true,
      post: user
    });

    //如果用户准备修改nickname，判断是否重复
    if (user.nickname) {
      const findUser = await service.user.getUserByNickname(this.params.nickname)
      if (findUser && String(findUser._id) !== String(this.userId)) {
        this.throwError('昵称已被人使用');
      }
    }

    //更新用户信息
    let updateRes = await service.user.update({ _id: this.userId }, this.params);

    if (updateRes) {
      this.throwCorrect({}, '用户信息更新成功');
    } else {
      this.throwError('用户信息更新失败。');
    }
  }

  /**
   * @description 获取用户列表（管理员接口）
   */
  async list() {
    const { ctx } = this;
    this.decorator({
      login: true
    });

    const usersRes = await ctx.service.user.find({});

    if (usersRes) {
      this.throwCorrect(usersRes);
    } else {
      this.throwError('查询失败');
    }
  }

  /**
   * @description 统计用户（管理员接口）
   */
  async count() {
    const { ctx } = this;
    this.decorator({
      login: true
    });

    const countNum = await ctx.service.user.count({});

    this.throwCorrect({
      count: countNum || 0
    });
  }

  /**
   * @description 修改密码（普通接口）
   */
  async password() {
    const { ctx, service } = this;
    this.decorator({
      login: true,
      post: {
        oldpass: { n: '旧密码', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } }, // 旧密码
        newpass: { n: '新密码', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } } // 新密码
      }
    });

    // 获取当前用户信息
    let findUser = await service.user.findOne({ _id: this.userId });

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.oldpass, findUser.password);

    // 密码不匹配
    if (!equal) {
      this.throwError('旧密码不正确');
    }

    // 修改密码
    let updateRes = await service.user.update({ _id: this.userId }, {
      password: ctx.helper.bhash(this.params.newpass)
    });

    if (updateRes) {
      this.throwCorrect({}, '密码修改成功');
    } else {
      this.throwError('密码修改失败');
    }
  }

  /**
   * @description 登陆（普通接口）
   */
  async login() {
    const { ctx } = this;
    this.decorator({
      post: {
        email: { n: '邮箱', type: 'Email', f: true, r: true },
        password: { n: '密码密文', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } }
      }
    });

    //判断用户是否存在
    const existUser = await ctx.service.user.getUserByMail(this.params.email);

    // 用户不存在
    if (!existUser) {
      this.throwError('用户不存在');
    }

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.password, existUser.password);

    // 密码不匹配
    if (!equal) {
      this.throwError('密码不正确');
    }

    //创建新的token
    let accessToken = uuid.v4();

    //获取用户的token
    let res = await ctx.service.token.getByUserId(existUser._id);

    //更新用户的token，没有则自动创建。
    if (res) { //更新 
      const now = (new Date()).getTime();
      const tomorrow = now + 1000 * 60 * 60 * 24;
      res = await ctx.service.token.updateToken({ userId: existUser._id }, {
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

    if (res) {
      this.throwCorrect({
        token: accessToken,
        userInfo: existUser
      }, '登陆成功');
    } else {
      this.throwError('登陆失败');
    }
  }

  /**
   * @description 登出（普通接口）
   */
  async logout() {
    const { service } = this;
    this.decorator({
      get: {
        token: { n: 'token', type: 'String', f: true, r: true },
        userId: { n: '用户id', type: 'ObjectId', f: true, r: true }
      }
    });

    let removeRes = await service.token.remove({
      token: this.params.token,
      userId: this.params.userId
    });

    if (removeRes) {
      this.throwCorrect({}, '登出成功');
    } else {
      this.throwError('登出失败');
    }
  }

}

module.exports = UserController;
