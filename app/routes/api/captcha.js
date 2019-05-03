/** 验证码接口 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/captcha/create', controller.api.captcha.create); //获取svg验证码
  router.get('/api/captcha/verify', controller.api.captcha.verify); //校验svg验证码
  router.get('/api/captcha/is', controller.api.captcha.is); //判断是否需要验证码
}
