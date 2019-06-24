'use strict';

const Service = require('egg').Service;
const nodemailer = require('nodemailer');

class MailService extends Service {
  async sendMail(data) {
    const {
      ctx,
      logger
    } = this;

    const transporter = nodemailer.createTransport({
      host: this.siteConfig.confEmailService,
      // service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: this.siteConfig.confEmailUser,//你的邮箱
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: this.siteConfig.confEmailPass,
      }
    });
    //smtps://<发送邮箱>:<授权码>@smtp.qq.com
    let isSuccess = false;
    do {
      try {
        await transporter.sendMail(data);
        logger.info('send mail success', data);
        isSuccess = true;
      } catch (err) {
        logger.error('Send mail error, ready to retry', err, data);
      }
    } while (isSuccess === false);
    return isSuccess;
  }

  /**
   * 发送邮箱验证码
   */
  async sendVerCode(options = {}, siteConfig) {
    const {
      ctx
    } = this;
    this.siteConfig = siteConfig;

    const from = `${siteConfig.subtitle} <${siteConfig.confEmailUser}>`;
    const to = options.email;
    const subject = options.title;
    const html = `<p>${options.content}</p>`;

    let res = await this.sendMail({
      from,
      to,
      subject,
      html,
    });
    return res;
  }
}

module.exports = MailService;