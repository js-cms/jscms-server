'use strict';

const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');

class CaptchaController extends BaseController {

	/**
   * @description 获取一个图形验证码
   */
	async create() {
    const { ctx, config } = this;
    let uid = ctx.query.uid;
    if (!uid) {
      ctx.response.set('content-type', 'application/json');
      ctx.body = {
        code: 1,
        msg: '请传入一个临时的uid以便记录唯一标识。'
      }
      return;
    }
    ctx.response.set('content-type', 'image/svg+xml ');
    const cap = svgCaptcha.create({
      size: 5,
      noise: 4,
      width: 200
    });
    this.appCache(uid, {
      vercode: cap.text.toLowerCase()
    });
    ctx.body = cap.data;
  }
  
  /**
   * @description 校验验证码（只做测试，一般不用在生产环境）
   */
  async verify() {
    const { ctx } = this;
    let str = ctx.query.str;
    ctx.body = str === ctx.session.captchaStr;
  }

  /**
   * @description 判断是否开启验证码
   */
  async is() {
    const { ctx, service } = this;
    let config = await service.config.findOne({alias: 'site'});
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
