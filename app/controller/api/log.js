'use strict';

const Controller = require('egg').Controller;

class LogController extends Controller {

	//获取日志列表
	async list() {
		const { ctx, service, config } = this;
		if (!ctx.locals.currentUser.auth.isLogin) {
			return ctx.helper.throwError(ctx, '你没有登陆', 403);
		}
		let type = Number(ctx.query.type);
		let pageSize = Number(ctx.query.pageSize);
		let pageNumber = Number(ctx.query.pageNumber);
		pageSize = isNaN(pageSize) ? 10 : pageSize;
		pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

		if (!type || isNaN(type)) {
			return ctx.helper.throwError(ctx, '参数错误');
		}

		//获取日志列表
		const findLogRes = await service.log.find({
			type: type
		}, pageNumber, pageSize);
		//获取日志总数
		const countLogRes = await service.log.count({
			type: type
		});
		ctx.body = {
			code: 0,
			msg: '查询成功',
			data: findLogRes,
			count: countLogRes
		};
	}

	//删除日志记录
	async delete() {
		const { ctx, service, config } = this;
		if (!ctx.locals.currentUser.auth.isLogin) {
			return ctx.helper.throwError(ctx, '你没有登陆', 403);
		}

		const id = ctx.request.body.id;

		if (!id) {
			return ctx.helper.throwError(ctx, '参数错误');
		}

		const deleteRes = await service.log.remove({_id: id});

		if (deleteRes) {
			ctx.body = {
				code: 0,
				msg: '日志记录删除完成'
			}
		} else {
			return ctx.helper.throwError(ctx, '日志记录删除失败');
		}
	}
}

module.exports = LogController;