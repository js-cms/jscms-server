'use strict';

const BaseController = require('./base');
let config = require('../../model/proto/config');

class ConfigController extends BaseController {

  /**
   * @description 获取单个配置信息
   */
  async show() {
    const { service } = this;
    this.decorator({
      login: true,
      get: {
        alias: { n: '英文别名', type: 'String', f: false, r: true }, //英文别名
      }
    });

    //查询
    const findRes = await service.config.findOne({ 'alias': this.params.alias });
    //输出结果
    this.throwCorrect(findRes);
  }

  /**
   * @description 更新配置信息
   */
  async update() {
    const { service } = this;
    config.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      login: true,
      post: config
    });

    const updateRes = await service.config.update({_id: this.params.id }, this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '更新成功');
    } else {
      this.throwError('更新失败');
    }
  }
}

module.exports = ConfigController;
