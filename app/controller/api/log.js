'use strict';

const BaseController = require('./base');

class LogController extends BaseController {

  /**
   * @description 获取配置列表
   */
	async list() {
		const { ctx, service } = this;
		this.decorator({
			login: true,
			get: {
				type: { n: '日志类型', type: 'Number', f: true, r: true }
			}
		});

		let type = this.params.type;
		let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);
		let query = { type: type };
		
		let method = ctx.query.method;
		let opName = ctx.query.opName;
		if (method) query['info.method'] = method;
		if (opName) query['info.opName'] = opName;

		//获取日志列表
		const findLogRes = await service.log.find(query, pageNumber, pageSize);

		//获取日志总数
		const countLogRes = await service.log.count(query);

		//输出结果
		this.throwCorrect({
			list: findLogRes,
			total: countLogRes
		}, '查询成功');
	}

  /**
   * @description 删除某条日志
   */
	async delete() {
		const { service } = this;
		this.decorator({
			login: true,
			get: {
				id: { type: 'ObjectId', f: true, r: true }
			}
		});

		const deleteRes = await service.log.remove({ _id: this.params.id });

		if (deleteRes) {
			this.throwCorrect({}, '日志记录删除完成')
		} else {
			this.throwError('日志记录删除失败');
		}
	}
}

module.exports = LogController;
