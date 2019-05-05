'use strict';

const Controller = require('egg').Controller;
const Model = require('modelman').Model;

/**
 * @description api错误类型，继承Error。
 */
class ApiError extends Error {

  /**
   * @description api错误类型，继承Error。
   * @param {String} message 消息文本
   * @param {Number} code 错误代码
   */
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
   * @param {Object} options 
   */
  async decorator(options) {
    const { ctx, service } = this;

    // 记录请求
    this.log();
    
    const toParams = options.toParams;

    // 验证码判断
    if (options.captcha === true) {
      let config = await service.config.findOne({alias: 'site'});
      let site = config.info;
      if (site.boolLoginVercode) {
        let uid = ctx.query.uid;
        let vercode = ctx.query.vercode.toLowerCase();
        let sourceVercode = this.appCache(uid) ? this.appCache(uid).vercode.toLowerCase() : '';
        if (!vercode) {
          this.throwError('请输入验证码');
        } else if (vercode !== sourceVercode) {
          this.throwError('验证码不正确');
        }
      }
    }
    // 验证权限
    if (typeof options.powers === 'object' && options.powers.length) {
      let resArray = [];
      options.powers.forEach((p) => {
        if (ctx.locals.currentUser.hasPower(p)) {
          resArray.push(true);
        }
      });
      if ( resArray.length !== options.powers.length ) {
        this.throwError('你没有权限', 403);
      }
    }
    // 验证登录
    if (!ctx.locals.currentUser.auth.isLogin) {
      if (options.login === true) {
        this.throwError('你没有登录', 403);
      }
    } else {
      this.userId = ctx.locals.currentUser.user._id;
    }

    this.params = {};

    /**
     * @description 参数解析器
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
        field.value = values[key] || field.defaultValue;
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

    if (options.get) parseParams('get', options.get);
    if (options.post) parseParams('post', options.post);
    if (options.params) parseParams('params', options.params);
  }

  /**
   * @description 抛出错误
   * @param {String} msg
   * @param {Number} code
   */
  throwError(
    msg = '未知错误',
    code = 1
  ) {
    throw new ApiError(
      msg,
      code
    );
  }

  /**
   * @description 返回数据
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
   * @description 记录请求
   */
  log() {
    const { ctx, service } = this;
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
    service.log.create({
      type: 3,
      info: info
    }).then((res) => {});
  }

  /**
   * @description 缓存操作
   */
  appCache(key, value) {
    const { ctx } = this;
    return ctx.helper.appCache(ctx.app, key, value);
  }
}

module.exports = BaseController;
