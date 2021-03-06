/**
 * 前台用户相关的api接口
 */

'use strict';

const BaseController = require('../base');
const uuid = require('uuid');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let userModel = require(`${modelPath}/user`);

class UserController extends BaseController {

  /**
   * 用户登录
   */
  async login() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      post: {
        email: {
          n: '邮箱',
          type: 'Email',
          f: true,
          r: true,
          extra: {
            errorMsg: '邮箱格式不正确'
          }
        },
        password: {
          n: '密码',
          type: 'Password',
          f: true,
          r: true,
          extra: {
            errorMsg: '密码格式不正确'
          }
        }
      }
    });

    //判断用户是否存在
    const existUser = await service.api.front.user.getUserByMail(this.params.email);

    // 用户不存在
    if (!existUser) this.throwError('用户不存在');

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.password, existUser.password);

    // 密码不匹配
    if (!equal) this.throwError('密码不正确');

    // 判断是否具有前台登录权限
    if (!ctx.hasPowers('member', existUser)) this.throwError('您没有前台的登录权限', 403);

    //创建新的token
    let accessToken = uuid.v4();

    //获取用户的token
    let res = await service.api.front.token.getByUserId(existUser._id);

    //更新用户的token，没有则自动创建。
    if (res) { //更新
      const now = (new Date()).getTime();
      const tomorrow = now + 1000 * 60 * 60 * 24;
      res = await service.api.front.token.updateToken({
        userId: existUser._id
      }, {
        token: accessToken,
        updateTime: now,
        passwExpiry: tomorrow
      });
    } else { //创建
      res = await service.api.front.token.create({
        userId: existUser._id,
        token: accessToken,
      });
    }
    let user = existUser._doc;
    delete user.password;
    if (res) {
      this.throwCorrect({
        token: accessToken,
        userInfo: user
      }, '登录成功');
    } else {
      this.throwError('登录失败');
    }
  }

  /**
   * 用户注册
   */
  async register() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      post: {
        email: {
          n: '邮箱',
          type: 'Email',
          f: true,
          r: true,
          extra: {
            errorMsg: '邮箱格式不正确'
          }
        },
        password: {
          n: '密码',
          type: 'Password',
          f: true,
          r: true,
          extra: {
            errorMsg: '密码格式不正确'
          }
        },
        vercode: {
          n: '验证码',
          type: 'vercode',
          f: true,
          r: false,
          extra: {
            errorMsg: '验证码不正确'
          }
        }
      }
    });

    //判断用户是否已经被创建
    const findUsers = await service.api.front.user.getUsersByQuery({
      $or: [{
        email: this.params.email
      }]
    });
    if (findUsers.length > 0) this.throwError('用户名或邮箱已被使用。');
    
    // 获取网站配置信息
    const site = await service.api.front.config.alias('site');
    let boolWebRegEmailActive = site.info.boolWebRegEmailActive;

    // 获取用户总数
    const count = await service.api.front.user.count({});

    let user = {
      nickname: `会员${count}`,
      email: this.params.email,
      password: this.params.password,
      powers: ['member'],
      active: boolWebRegEmailActive ? false : true
    }

    //创建用户
    const createUser = await service.api.front.user.create(user);

    //如果用户添加成功
    if (createUser._id) {
      this.throwCorrect({}, '注册成功');
    } else {
      this.throwError('注册失败 请联系管理员')
    }
  }

  /**
   * 用户注销
   */
  async logout() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        token: {
          n: 'token',
          type: 'String',
          f: true,
          r: true
        },
        userId: {
          n: '用户id',
          type: 'ObjectId',
          f: true,
          r: true
        }
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

  /** 
   * 用户读取信息
   */
  async getInfo() {
    const {
      ctx,
      service
    } = this;
    
    const user = await service.api.front.user.userId(this.userId);

    if (user) {
      this.throwCorrect(user);
    } else {
      this.throwError('没有找到该用户的信息');
    }
  }

  /**
   * 用户修改信息
   */
  async updateInfo() {
    const {
      service
    } = this;
    let user = _.cloneDeep(userModel);
    delete user.password;
    await this.decorator({
      post: user
    });

    //如果用户准备修改nickname，判断是否重复
    if (user.nickname) {
      const findUser = await service.api.front.user.getUserByNickname(this.params.nickname)
      if (findUser && String(findUser._id) !== String(this.userId)) {
        this.throwError('昵称已被人使用');
      }
    }

    //更新用户信息
    let updateRes = await service.api.front.user.update({
      _id: this.userId
    }, this.params);

    if (updateRes) {
      this.throwCorrect({}, '用户信息更新成功');
    } else {
      this.throwError('用户信息更新失败。');
    }
  }

  /**
   * 用户修改密码
   */
  async updatePassword() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      post: {
        oldpass: {
          n: '旧密码',
          type: 'Password',
          f: true,
          r: true,
          extra: {
            errorMsg: '密码格式不正确'
          }
        }, // 旧密码
        newpass: {
          n: '新密码',
          type: 'Password',
          f: true,
          r: true,
          extra: {
            errorMsg: '密码格式不正确'
          }
        } // 新密码
      }
    });

    // 获取当前用户信息
    let findUser = await service.api.front.user.userId(this.userId);

    // 比较密码
    const equal = ctx.helper.bcompare(this.params.oldpass, findUser.password);

    // 密码不匹配
    if (!equal) {
      this.throwError('旧密码不正确');
    }

    // 修改密码
    let updateRes = await service.api.front.user.update({
      _id: this.userId
    }, {
      password: ctx.helper.bhash(this.params.newpass)
    });

    if (updateRes) {
      this.throwCorrect({}, '密码修改成功');
    } else {
      this.throwError('密码修改失败');
    }
  }

}

module.exports = UserController;