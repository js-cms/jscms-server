/**
 * api基类控制器
 */

'use strict';

const Controller = require('egg').Controller;
const Model = require('modelman').Model;
const is = require('ispro');

class BaseController extends Controller {

  /**
   * 预处理/拦截/解析 公共函数
   * @param {Object} options 
   */
  async decorator(options) {
    const {
      ctx,
      service
    } = this;
    const app = ctx.app;
    const currentUser = ctx.locals.currentUser;
    const toParams = options.toParams;

    this.log(); // 记录请求
    this.params = {};
    this.userId = currentUser.user._id;

    /**
     * 参数解析器
     * @param {String} method 
     * @param {Object} params 
     */
    const parseParams = (method, params) => {
      if (!params || typeof params !== 'object') return;
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
        let key = field.name;
        field.value = is.valid(values[key]) ? values[key] : field.defaultValue;
      });
      let res = model.validator.all();
      let errorMsg = '参数不正确';
      if (res.length === 0) {
        let params = model.to.json(toParams);
        this.params = params;
      } else {
        let key = res[0].name;
        let item = model.fields[key];
        errorMsg = '参数不正确';
        if (item.extra && item.extra.errorMsg) {
          errorMsg = item.extra.errorMsg || errorMsg;
        }
        console.log(res);
        this.throwError(errorMsg, 1);
      }
    }

    // 需要校验验证码
    if (options.captcha === true) {
      let config = await service.api.back.config.alias('site');
      let site = config.info;
      if (site.boolLoginVercode) {
        let uid = ctx.query.uid;
        let vercode = ctx.query.vercode.toLowerCase();
        let sourceVercode = app.cache(uid) ? app.cache(uid).vercode.toLowerCase() : '';
        if (!vercode) {
          this.throwError('请输入验证码');
        } else if (vercode !== sourceVercode) {
          this.throwError('验证码不正确');
        }
      }
    }

    // 需要校验登录
    if (options.login) {
      if (!currentUser.auth.isLogin) this.throwError('你没有登录', 403);
    }

    // 需要校验验证身份
    if (typeof options.powers === 'object' && options.powers.length) {
      return ctx.hasPowers(options.powers);
    }

    // 需要校验参数
    ['get', 'post', 'params'].forEach(i => {
      if (options[i]) parseParams(i, options[i]);
    });
  }

  /**
   * 抛出错误
   * @param {String} msg
   * @param {Number} code
   */
  throwError(
    msg = '未知错误',
    code = 1
  ) {
    const ctx = this.ctx;
    const app = ctx.app;
    app.throwJsonError(msg, code);
  }

  /**
   * 返回数据
   * @param {*} data
   * @param {String} msg
   * @param {Number} code
   */
  throwCorrect(
    data,
    msg = '查询成功',
    code = 0
  ) {
    const ctx = this.ctx;
    ctx.body = {
      code: code,
      msg: msg,
      data: data
    };
    return true;
  }

  /**
   * 记录请求
   */
  log() {
    const {
      ctx,
      service
    } = this;
    let visPath = ctx.request.path;
    const table = {
      '/api/login': '登录',
      '/api/logout': '登出',
      '/api/article/create': '创建文章',
      '/api/article/update': '修改文章',
      '/api/article/delete': '创建文章',
      '/api/analysis/ip': '查看ip统计',
      '/api/analysis/pv': '查看pv统计',
      '/api/model': '获取模型'
    };
    const exclude = [
      '/api/article/like',
      '/api/comment/webcreate',
      '/api/log/'
    ];

    /**
     * 获取操作名称
     */
    const getOpName = () => {
      let name = table[visPath];
      if (name) {
        return name;
      } else {
        return '其他操作';
      }
    }

    /**
     * 检查是否允许记录
     */
    const checkValid = () => {
      let prefix = visPath.substring(0, 4);
      if (prefix !== '/api') {
        return false;
      } else if (ctx.helper.includesPart(exclude, visPath)) {
        return false;
      } else {
        return true;
      }
    }
    if (!checkValid()) return;

    let info = {
      opName: getOpName(),
      method: ctx.request.method,
      params: {},
      fullUrl: ctx.origin + ctx.url,
      opIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
      opReferer: ctx.headers['referer'],
      opUserAgent: ctx.headers['user-agent'],
      opHeaders: ctx.headers
    }
    if (ctx.request.method === 'GET') {
      info.params = ctx.query || {};
    } else {
      info.params = ctx.request.body || {};
    }
    //将访问者信息插入log表
    service.api.back.log.create({
      type: 3,
      info: info
    }).then((res) => {});
  }
}

module.exports = BaseController;