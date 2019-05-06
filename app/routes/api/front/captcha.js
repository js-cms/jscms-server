/** 验证码接口 */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/front/captcha/create', controller.api.front.captcha.create); //获取svg验证码
  router.get('/api/front/captcha/verify', controller.api.front.captcha.verify); //校验svg验证码
  router.get('/api/front/captcha/is', controller.api.front.captcha.is); //判断是否需要验证码
}
