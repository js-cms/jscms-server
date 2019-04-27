'use strict';

const path = require('path');

const Controller = require('egg').Controller;
const Model = require('modelman').Model;
const is = require('ispro');

/**
 * @description api错误类型，继承Error。
 */
class ApiError extends Error {
  constructor(
    message = '未知错误',
    code = 1
  ) {
    super(message);
    this.name = 'apierror';
    this.message = message;
    this.code = code;
  }
}

/**
 * @description api基类控制器
 */
class BaseController extends Controller {

  /**
   * @description 预处理/拦截/解析 公共函数
   */
  decorator(options) {
    const { ctx, service, config } = this;
    const mongoose = ctx.app.mongoose;
   
    if (!ctx.locals.currentUser.auth.isLogin) {
      if ( options.login === true ) {
        this.throwError('你没有登陆', 403);
      }
    } else {
      this.userId = ctx.locals.currentUser.user._id;
    }

    this.params = {};

    const parseParams = (method, params) => {
      if(!params || typeof params !== 'object') return;
      const model = new Model({
        name: 'Model',
        displayName: '临时模型'
      });
      model.assign(params);
      let values = {};
      if (method === 'params') {
        values = ctx.params;
      } else if (method === 'post') {
        values = ctx.request.body;
      } else {
        values = ctx.query;
      }
      model._iterator(field => {
        field.value = field.defaultValue;
      });
      model.setData(values);
      let res = model.validator.all();
      console.log('res', res);
      let errorMsg = '参数不正确';
      if ( res.length === 0 ) {
        this.params = model.to.json();
      } else {
        let key = res[0].name;
        let item = model.fields[key];
        let errorMsg = '参数不正确';
        if (item.extra && item.extra.errorMsg) {
          errorMsg = item.extra.errorMsg || errorMsg;
        }
        this.throwError(errorMsg, 1);
      }
    }

    if (options.get) parseParams('get', options.get);
    if (options.post) parseParams('post', options.post);
    if (options.params) parseParams('params', options.params);
  }

  /**
   * @description 抛出错误
   */
  throwError(msg, code) {
    throw new ApiError(
      msg,
      code
    );
  }

  /**
   * @description 输出正确数据
   */
  throwCorrect(data, msg, code) {
    const ctx = this.ctx;
    ctx.body = {
      code: code || 0,
      msg: msg || '查询成功',
      data: data
    };
    return true;
  }
}

module.exports = BaseController;
