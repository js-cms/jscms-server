'use strict';

const BaseController = require('./base');

class AnalysisController extends BaseController {

	/**
   * @description 统计独立ip
   */
	async ip() {
		const { service } = this;
		this.decorator({
			login: true,
			get: {
				startTime: { n: '开始时间', type: 'Timestamp', d: 0, f: true, r: true },
				endTime: { n: '结束时间', type: 'Timestamp', d: new Date().getTime(), f: true, r: true }
			}
		});

		// 获取日志总数
		const logs = await service.log.findAll({
			type: 1,
			createTime: {
				$gte: this.params.startTime,
				$lt: this.params.endTime
			}
		});

		this.throwCorrect(logs);
	}

	/**
   * @description 统计pv浏览量
   */
	async pv() {
		const { service } = this;
		this.decorator({
			login: true,
			get: {
				startTime: { n: '开始时间', type: 'Timestamp', d: 0, f: true, r: true },
				endTime: { n: '结束时间', type: 'Timestamp', d: new Date().getTime(), f: true, r: true }
			}
		});

		// 获取日志总数
		const logs = await service.log.findAll({
			type: 1,
			createTime: {
				$gte: this.params.startTime,
				$lt: this.params.endTime
			}
		});

		this.throwCorrect(logs);
	}
}

module.exports = AnalysisController;
