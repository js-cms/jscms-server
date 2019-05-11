/**
 * 后台文章草稿相关接口
 */

'use strict';

const BaseController = require('../base');
const _ = require('lodash');

const TYPE = 'backDraftArticle';
const modelPath = `${process.cwd()}/app/model/proto`;
let cacheModel = require(`${modelPath}/cache`);

class ArticleDraftController extends BaseController {

  /**
   * 根据文章标题获取文章草稿
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        name: { n: '文章标题', type: 'String', f: true, t: true, r: true, extra: { errorMsg: '缺少文章标题' } }, //文章标题
      }
    });
    const draft = await service.api.back.cache.byTypeName(TYPE, this.params.name); 
    if (draft) {
      this.throwCorrect(draft, '查询成功');
    } else {
      this.throwError('没有找该文章标题的草稿');
    }
  }

  /**
   * 创建文章草稿
   */
  async create() {
    const {
      service
    } = this;
    let cache = _.cloneDeep(cacheModel);
    cache.name.extra = { errorMsg: '请至少先填写文章标题，用于筛选。' };
    await this.decorator({
      post: cache,
      toParams: {
        formField: true
      }
    });
    this.params.type = TYPE;
  
    const cacheResult = await service.api.back.cache.byTypeName(this.params.type, this.params.name); 

    if (cacheResult) this.throwError('已存在文章标题，请重新命名。');

    const result = await service.api.back.cache.create(this.params); 
    
    if (result) {
      this.throwCorrect(result, '文章草稿创建成功');
    } else {
      this.throwError('文章草稿创建失败');
    }
  }

  /**
   * 根据文章标题更新文章草稿
   */
  async update() {
    const {
      service
    } = this;
    let cache = _.cloneDeep(cacheModel);
    cache.name.extra = { errorMsg: '请至少先填写文章标题，用于筛选。' };
    await this.decorator({
      post: cache,
      toParams: {
        formField: true
      }
    });
    this.params.type = TYPE;
  
    const result = await service.api.back.cache.update({
      type: this.params.type,
      name: this.params.name
    }, this.params); 

    if (result) {
      this.throwCorrect(result, '文章草稿更新成功');
    } else {
      this.throwError('文章草稿更新失败');
    }
  }

  /**
   * 删除文章草稿
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '草稿id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const result = await service.api.back.cache.remove({
      _id: this.params.id
    });

    if (result) {
      this.throwCorrect({}, '草稿删除成功');
    } else {
      this.throwError('草稿删除失败');
    }
  }

  /**
   * 获取文章草稿列表
   */
  async list() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      get: {
        keyword: {
          type: 'String',
          f: true,
          r: false
        }
      }
    });
    const keyword = this.params.keyword;
    const {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    //获取文章列表
    const {
      list,
      total
    } = await service.api.back.cache.search({
      and: [],
      keyword: keyword,
      pageNumber: pageNumber,
      pageSize: pageSize
    });

    this.throwCorrect({
      list: list,
      total: total
    }, '查询成功');
  }
}

module.exports = ArticleDraftController;
