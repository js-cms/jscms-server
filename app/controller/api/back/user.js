/**
 * 后台用户相关接口
 */

'use strict';

const uuid = require('uuid');
const _ = require('lodash');

const BaseController = require('../base');
let userModel = require('../../../model/proto/user');

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
   * @description 获取当前用户的信息（登录用户接口）
   */
  async self() {
    const { ctx } = this;

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
      post: userModel
    });

    //判断用户是否已经被创建
    const findUsers = await ctx.service.user.getUsersByQuery({
      $or: [{ email: this.params.email }]
    });
    if (findUsers.length > 0) this.throwError('用户名或邮箱已被使用。');
    
    //获取用户总数
    const count = await ctx.service.user.count({});
    if (!this.params.nickname) {
      this.params.nickname = '会员' + count;
    }

    //创建用户
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
      post: {
        id: { n: '用户id', type: 'ObjectId', f: true, r: true }
      }
    });

    const user = await service.user.findOne({ _id: this.params.id });

    if(!user) this.throwError('没有找到这个用户');

    if (user.powers && user.powers.length && user.powers[0] === 'super') {
      this.throwError('不能删除超级管理员用户');
    }

    const deleteRes = await service.user.remove({ _id: this.params.id });

    if (deleteRes) {
      this.throwCorrect({}, '删除用户成功');
    } else {
      this.throwError('删除用户失败');
    }
  }

  /**
   * @description 更新一个用户的信息
   */
  async update() {
    const { service } = this;
    let user = _.cloneDeep(userModel); 
    user.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
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
   * @description 获取用户列表
   */
  async list() {
    const { ctx } = this;

    // 查找列表
    const users = await ctx.service.user.find({});

    if (users) {
      this.throwCorrect(users);
    } else {
      this.throwError('查询失败');
    }
  }

  /**
   * @description 修改密码
   */
  async password() {
    const { ctx, service } = this;
    this.decorator({
      post: {
        oldpass: { n: '旧密码', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } }, // 旧密码
        newpass: { n: '新密码', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } } // 新密码
      }
    });

    // 如果没有登陆
    if (!this.userId) this.throwError('请先登陆后台', 403);

    // 获取当前用户信息
    let user = await service.user.findOne({ _id: this.userId });

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.oldpass, user.password);

    // 密码不匹配
    if (!equal) this.throwError('旧密码不正确');

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
   * @description 登录
   */
  async login() {
    const { ctx } = this;
    const app = ctx.app;
    await this.decorator({
      post: {
        email: { n: '邮箱', type: 'Email', f: true, r: true, extra: {errorMsg: '邮箱格式不正确'} },
        password: { n: '密码', type: 'Password', f: true, r: true, extra: { errorMsg: '密码格式不正确' } }
      }
    });

    //判断用户是否存在
    const existUser = await ctx.service.user.getUserByMail(this.params.email);

    // 用户不存在
    if (!existUser) this.throwError('用户不存在');

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.password, existUser.password);

    // 密码不匹配
    if (!equal) this.throwError('密码不正确');
    
    // 判断是否具有后台登录权限
    if (!ctx.hasPowers('admin', existUser)) this.throwError('您没有后台系统的登录权限', 403);

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
      }, '登录成功');
    } else {
      this.throwError('登录失败');
    }
  }

  /**
   * @description 退出登陆
   */
  async logout() {
    const { service } = this;
    this.decorator({
      get: {
        token: { n: 'token', type: 'String', f: true, r: true },
        userId: { n: '用户id', type: 'ObjectId', f: true, r: true }
      }
    });

    let removeResult = await service.token.remove({
      token: this.params.token,
      userId: this.params.userId
    });

    if (removeResult) {
      this.throwCorrect({}, '登出成功');
    } else {
      this.throwError('登出失败');
    }
  }

}

module.exports = UserController;
