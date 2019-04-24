'use strict';

const Controller = require('egg').Controller;

class AnalysisController extends Controller {

	/**
   * @description 统计独立ip
   */
	async ip() {
		const { ctx, service, config } = this;
		if (!ctx.locals.currentUser.auth.isLogin) {
			return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    
    let { startTime, endTime } = ctx.query;
    startTime = startTime || 0;
    endTime = endTime || new Date().getTime();

		//获取日志总数
    const logs = await service.log.findAll({type: 1, createTime: {$gte: startTime, $lt: endTime}});

		ctx.body = {
			code: 0,
			msg: '查询成功',
			data: logs
		};
	}

	/**
   * @description 统计pv浏览量
   */
	async pv() {
		const { ctx, service, config } = this;
		if (!ctx.locals.currentUser.auth.isLogin) {
			return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    
    let { startTime, endTime } = ctx.query;
    startTime = startTime || 0;
    endTime = endTime || new Date().getTime();

		//获取日志总数
    const logs = await service.log.findAll({type: 1, createTime: {$gte: startTime, $lt: endTime}});

		ctx.body = {
			code: 0,
			msg: '查询成功',
			data: logs
		};
	}
}

module.exports = AnalysisController;
