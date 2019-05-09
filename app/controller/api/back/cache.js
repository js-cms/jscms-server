/**
 * 硬盘缓存数据相关接口
 */

'use strict';

const BaseController = require('../base');

class CacheController extends BaseController {

  /**
   * 根据id获取某条缓存信息
   */
  async show() {
    const {
      service
    } = this;
    this.decorator({
      get: {
        id: {
          n: '缓存id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    //查询
    const cache = await service.cache.findOne({ _id: this.params.id });

    //输出结果
    this.throwCorrect(cache);
  }

}

module.exports = CacheController;