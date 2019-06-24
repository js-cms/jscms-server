/**
 * 前台文章相关的api接口
 */

'use strict';

const BaseController = require('../base');

class MailController extends BaseController {

  /**
   * 发送邮件验证码
   */
  async sendVerCode() {
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
      }
    });
    
    let config = await service.api.back.config.alias('site');
    let site = config.info;
    const verCode = ctx.helper.randNum(100000, 999999);
    const params = {
      email: this.params.email,
      title: `【${site.subtitle}】邮箱验证码`,
      content: `【${site.subtitle}】尊敬的用户，您的验证码是：${verCode}，该验证码30分钟之内有效，如非本人操作，请忽略本邮件。`
    }

    // 发送验证码到邮件
    let res = await service.api.front.mail.sendVerCode(params, site);
    if (res) {
      this.throwCorrect({}, '发送成功');
    } else {
      this.throwError('发送失败');
    }

  }
}

module.exports = MailController;