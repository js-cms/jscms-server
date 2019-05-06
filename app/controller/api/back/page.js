/**
 * 后台自定义页面相关接口
 */

'use strict';

const _ = require('lodash');

const BaseController = require('../base');
let pageModel = require('../../../model/proto/page');

class PageController extends BaseController {

  /**
   * @description 新增页面
   */
  async create() {
    const { service } = this;
    this.decorator({
      post: pageModel
    });

    let params = this.params;

    //查找同别名页面
    let page = await service.page.findOne({
      alias: params.alias
    });

    //找到重复的别名
    if (page) {
      this.throwError('别名重复');
    }

    //创建页面
    let result = await service.page.create(params);

    if (result._id) {
      this.throwCorrect(result, '页面创建完成');
    } else {
      this.throwError('页面创建失败');
    }
  }

  /**
   * @description 更新页面
   */
  async update() {
    const { service } = this;
    let page = _.cloneDeep(pageModel); 
    page.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      post: page
    });

    const result = await service.page.update({ _id: this.params.id }, this.params);

    if (result) {
      this.throwCorrect(result, '页面更新成功');
    } else {
      this.throwError('页面更新失败');
    }
  }

  /**
   * @description 删除页面
   */
  async delete() {
    const { service } = this;
    this.decorator({
      post: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const result = await service.page.remove({ _id: this.params.id });

    if (result) {
      this.throwCorrect({}, '页面删除完成');
    } else {
      this.throwError('页面删除失败');
    }
  }

  /**
   * @description 获取页面列表
   */
  async list() {
    const { ctx, service } = this;
    const { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    //获取页面列表
    const page = await service.page.find({}, pageNumber, pageSize);

    //获取文章总数
    const total = await service.page.count({});

    //输出结果
    this.throwCorrect({
      list: page,
      total: total
    }, '查询成功');
  }

  /**
   * @description 获取单个页面
   */
  async show() {
    const { service } = this;
    this.decorator({
      get: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    //获取文章
    const page = await service.page.findOne({ _id: this.params.id });

    if (page) {
      //输出结果
      this.throwCorrect(page, '查询成功');
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = PageController;
