/**
 * 后台统计相关接口
 */

'use strict';

const BaseController = require('../base');

class AnalysisController extends BaseController {

  /**
   * 统计独立ip
   */
  async ip() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        startTime: {
          n: '开始时间',
          type: 'Timestamp',
          d: 0,
          f: true,
          r: true
        },
        endTime: {
          n: '结束时间',
          type: 'Timestamp',
          d: new Date().getTime(),
          f: true,
          r: true
        }
      }
    });

    // 查找符合条件的多个日志
    const logs = await service.api.back.log.all({ 
      type: 1,
      createTime: {
        $gte: this.params.startTime,
        $lt: this.params.endTime
      }
    });

    // 输出数据
    this.throwCorrect(logs);
  }

  /**
   * 统计pv浏览量
   */
  async pv() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        startTime: {
          n: '开始时间',
          type: 'Timestamp',
          d: 0,
          f: true,
          r: true
        },
        endTime: {
          n: '结束时间',
          type: 'Timestamp',
          d: new Date().getTime(),
          f: true,
          r: true
        }
      }
    });

    // 获取日志总数
    const logs = await service.api.back.log.all({
      type: 1,
      createTime: {
        $gte: this.params.startTime,
        $lt: this.params.endTime
      }
    });

    // 输出数据
    this.throwCorrect(logs);
  }

  /**
   * 统计搜索量
   */
  async search() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        startTime: {
          n: '开始时间',
          type: 'Timestamp',
          d: 0,
          f: true,
          r: true
        },
        endTime: {
          n: '结束时间',
          type: 'Timestamp',
          d: new Date().getTime(),
          f: true,
          r: true
        }
      }
    });

    // 获取日志总数
    const logs = await service.api.back.log.all({
      type: 2,
      createTime: {
        $gte: this.params.startTime,
        $lt: this.params.endTime
      }
    });

    // 输出数据
    this.throwCorrect(logs);
  }
}

module.exports = AnalysisController;
