/**
 * 中间件：错误处理钩子
 */

'use strict';

module.exports = options => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      // 如果是api的报错类型
      if (err.name === 'apierror') {
        ctx.response.set('content-type', 'application/json');
        ctx.status = 200;
        ctx.body = {
          msg: err.message,
          code: err.code
        }
        return;
      } else { // 其他报错类型
        const status = err.status || 500;
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        const error = status === 500 && ctx.app.config.env === 'prod' ?
          'Internal Server Error' :
          err.message;

        // 从 error 对象上读出各个属性，设置到响应中
        ctx.body = {
          error
        };
        if (status === 422) {
          ctx.body.detail = err.errors;
        }
        ctx.status = status;
        return;
      }
    }
  }
}