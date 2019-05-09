/**
 * 后台文章草稿相关接口
 */

'use strict';

const BaseController = require('../base');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let cacheModel = require(`${modelPath}/cache`);

class ArticleDraftController extends BaseController {

  /**
   * 创建文章草稿
   */
  async create() {
    const {
      service
    } = this;
    let cache = _.cloneDeep(cacheModel);
    cache.name.extra = { errorMsg: '新建文章草稿，请至少先填写文章标题。' };
    this.decorator({
      post: cacheModel,
      toParams: {
        formField: true
      }
    });
    
    this.params.type = 'draftArticle';

    const result = await service.api.back.cache.create(this.params);

    if (result) {
      this.throwCorrect(updateRes, '文章草稿创建成功');
    } else {
      this.throwError('文章草稿创建失败');
    }
  }

  /**
   * 更新文章草稿
   */
  async update() {}

  /**
   * 删除文章草稿
   */
  async delete() {}

  /**
   * 获取文章草稿列表
   */
  async list() {}
}

module.exports = ArticleDraftController;
