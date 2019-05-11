/**
 * 后台自定义页面相关接口
 */

'use strict';

const BaseController = require('../base');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let pageModel = require(`${modelPath}/page`);

class PageController extends BaseController {

  /**
   * 新增页面
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: pageModel
    });

    let params = this.params;

    //查找同别名页面
    let page = await service.api.back.page.findOne({
      alias: params.alias
    });

    //找到重复的别名
    if (page) {
      this.throwError('别名重复');
    }

    //创建页面
    let result = await service.api.back.page.create(params);

    if (result._id) {
      this.throwCorrect(result, '页面创建完成');
    } else {
      this.throwError('页面创建失败');
    }
  }

  /**
   * 更新页面
   */
  async update() {
    const {
      service
    } = this;
    let page = _.cloneDeep(pageModel);
    page.id = {
      n: '页面id',
      type: 'ObjectId',
      f: true,
      r: true
    };
    await this.decorator({
      post: page
    });

    const result = await service.api.back.page.update({
      _id: this.params.id
    }, this.params);

    if (result) {
      this.throwCorrect(result, '页面更新成功');
    } else {
      this.throwError('页面更新失败');
    }
  }

  /**
   * 删除页面
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '页面id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const result = await service.api.back.page.remove({
      _id: this.params.id
    });

    if (result) {
      this.throwCorrect({}, '页面删除完成');
    } else {
      this.throwError('页面删除失败');
    }
  }

  /**
   * 获取页面列表
   */
  async list() {
    const {
      ctx,
      service
    } = this;
    const {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    //获取页面列表
    const page = await service.api.back.page.find({}, pageNumber, pageSize);

    //获取文章总数
    const total = await service.api.back.page.count({});

    //输出结果
    this.throwCorrect({
      list: page,
      total: total
    }, '查询成功');
  }

  /**
   * 获取单个页面
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        id: {
          n: '页面id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    //获取文章
    const page = await service.api.back.page.findOne({
      _id: this.params.id
    });

    if (page) {
      //输出结果
      this.throwCorrect(page, '查询成功');
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = PageController;