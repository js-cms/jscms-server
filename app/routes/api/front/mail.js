/** 邮箱相关api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/front/mail/sendVerCode', controller.api.front.mail.sendVerCode); // 发送邮箱验证码
}
