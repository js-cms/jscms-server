/**
 * 后台日志相关接口
 */

'use strict';

const BaseController = require('../base');

class LogController extends BaseController {

  /**
   * 获取配置列表
   */
  async list() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      get: {
        type: {
          n: '日志类型',
          type: 'Number',
          f: true,
          r: true
        }
      }
    });

    let type = this.params.type;
    let {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);
    let query = {
      type: type
    };

    let method = ctx.query.method;
    let opName = ctx.query.opName;
    if (method) query['info.method'] = method;
    if (opName) query['info.opName'] = opName;

    //获取日志列表
    const logs = await service.api.back.log.find(query, pageNumber, pageSize);

    //获取日志总数
    const total = await service.api.back.log.count(query);

    //输出结果
    this.throwCorrect({
      list: logs,
      total: total
    }, '查询成功');
  }

  /**
   * 删除某条日志
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '日志id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const deleteRes = await service.api.back.log.remove({
      _id: this.params.id
    });

    if (deleteRes) {
      this.throwCorrect({}, '日志记录删除完成')
    } else {
      this.throwError('日志记录删除失败');
    }
  }
}

module.exports = LogController;