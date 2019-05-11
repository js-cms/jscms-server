/**
 * 应用程序配置相关接口
 */

'use strict';

const BaseController = require('../base');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let configModel = require(`${modelPath}/config`);

class ConfigController extends BaseController {

  /**
   * 获取单个配置信息
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        alias: { // 英文别名
          n: '英文别名',
          type: 'String',
          f: false,
          r: true
        },
      }
    });

    //查询
    const findRes = await service.api.back.config.findOne({
      'alias': this.params.alias
    });

    //输出结果
    this.throwCorrect(findRes);
  }

  /**
   * 更新配置信息
   */
  async update() {
    const {
      service
    } = this;
    let config = _.cloneDeep(configModel);
    config.id = {
      n: '配置id',
      type: 'ObjectId',
      f: true,
      r: true
    };
    await this.decorator({
      post: config,
      toParams: {
        formField: true
      }
    });

    const updateRes = await service.api.back.config.update({
      _id: this.params.id
    }, this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '更新成功');
    } else {
      this.throwError('更新失败');
    }
  }
}

module.exports = ConfigController;