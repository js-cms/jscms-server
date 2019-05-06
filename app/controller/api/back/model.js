'use strict';

const BaseController = require('../base');
const models = require('../../../model/proto/index');

class ModelController extends BaseController {

  /**
   * @description 获取数据模型
   */
  async index() {
		this.decorator({
			login: true,
			get: {
				name: { type: 'Stirng', r: true }
			}
    });
    
    let model = models[this.params.name];
    if (!model) {
      this.throwError('没有找到这个模型');
    }

    //输出模型
    this.throwCorrect({
      model: model
    }, '查询成功');
  }
}

module.exports = ModelController;