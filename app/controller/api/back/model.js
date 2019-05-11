/**
 * 后台模型相关接口
 */

'use strict';

const BaseController = require('../base');

const modelPath = `${process.cwd()}/app/model/proto`;
let models = require(`${modelPath}/index`);

class ModelController extends BaseController {

  /**
   * 获取数据模型
   */
  async index() {
    await this.decorator({
      get: {
        name: {
          type: 'Stirng',
          r: true
        }
      }
    });

    const model = models[this.params.name];

    if (!model) this.throwError('没有找到这个模型');

    //输出模型
    this.throwCorrect({
      model: model
    }, '查询成功');
  }
}

module.exports = ModelController;