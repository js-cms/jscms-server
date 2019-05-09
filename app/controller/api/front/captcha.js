/**
 * 前/后台验证码相关接口
 */

'use strict';

const BaseController = require('../base');
const svgCaptcha = require('svg-captcha');

class CaptchaController extends BaseController {

  /**
   * 获取一个图形验证码
   */
  async create() {
    const {
      ctx
    } = this;
    const app = ctx.app;
    const uid = ctx.query.uid;
    ctx.response.set('content-type', 'image/svg+xml ');

    if (!uid) app.throwJsonError('请传入一个临时的uid以便记录唯一标识。');

    const cap = svgCaptcha.create({
      size: 5,
      noise: 4,
      width: 200
    });

    app.cache(uid, {
      vercode: cap.text.toLowerCase()
    });

    ctx.body = cap.data;
  }

  /**
   * 校验验证码（只做测试，一般不用在生产环境）
   */
  async verify() {
    const {
      ctx
    } = this;
    const app = ctx.app;
    const uid = ctx.query.uid;
    const str = ctx.query.str;
    const cache = app.cache(uid);
    const vercode = cache.vercode
    ctx.body = str === vercode;
  }

  /**
   * 判断是否开启验证码
   */
  async is() {
    const {
      ctx,
      service
    } = this;
    let config = await service.config.findOne({
      alias: 'site'
    });
    let site = config.info;
    ctx.body = {
      code: 0,
      data: {
        boolLoginVercode: site.boolLoginVercode
      }
    }
  }
}

module.exports = CaptchaController;