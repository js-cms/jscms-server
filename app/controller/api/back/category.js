/**
 * 后台分类相关接口
 */

'use strict';

const BaseController = require('../base');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let categoryModel = require(`${modelPath}/category`);

class CategoryController extends BaseController {

  /**
   * 创建分类
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: categoryModel,
      toParams: {
        formField: true
      }
    });

    let params = this.params;

    //查找分类
    let findRes = await service.api.back.category.findOne({
      name: params.name,
      alias: params.alias
    });

    //判断是否存在重复分类
    if (findRes) {
      this.throwError('分类已存在');
    }

    //分类创建结果
    const createCatRes = await service.api.back.category.create(params);

    if (createCatRes._id) {
      this.throwCorrect(createCatRes, '分类创建完成');
    } else {
      this.throwError('分类创建失败');
    }
  }

  /**
   * 更新分类
   */
  async update() {
    const {
      service
    } = this;
    let category = _.cloneDeep(categoryModel);
    category.id = {
      n: '分类id',
      type: 'ObjectId',
      f: true,
      r: true
    };
    await this.decorator({
      post: category,
      toParams: {
        formField: true
      }
    });

    const updateRes = await service.api.back.category.update({
      _id: this.params.id
    }, this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '分类更新成功');
    } else {
      this.throwError('分类更新失败');
    }
  }

  /**
   * 快速更新分类
   */
  async fastUpdate() {
    const {
      service
    } = this;
    let category = {
      id: {
        n: '分类id',
        type: 'ObjectId',
        f: true,
        r: true
      }, // 文章id
      order: {
        n: '排序权重',
        type: 'Number',
        f: true,
        t: true,
        r: false,
        d: 0
      }, //排序权重
      name: {
        n: '中文分类名称',
        type: 'String',
        f: true,
        t: true,
        r: true
      }, //中文分类名称
      alias: {
        n: '英文分类别名',
        type: 'String',
        f: true,
        t: true,
        r: true
      } //英文分类别名
    }

    await this.decorator({
      post: category,
      toParams: {
        formField: true
      }
    });

    // 更新分类
    const updateRes = await service.api.back.category.update({
      _id: this.params.id
    }, this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '分类更新成功');
    } else {
      this.throwError('分类更新失败');
    }
  }

  /**
   * 删除分类
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '分类id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const deleteRes = await service.api.back.category.remove({
      _id: this.params.id
    });

    if (deleteRes) {
      this.throwCorrect({}, '分类删除完成');
    } else {
      this.throwError('分类创建失败');
    }
  }

  /**
   * 获取分类列表
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

    const list = await service.api.back.category.find({}, pageNumber, pageSize);
    const total = await service.api.back.category.count({});

    // 输出列表
    this.throwCorrect({
      list: list,
      total: total
    }, '查询成功');
  }

  /**
   * 获取全部分类数据
   */
  async all() {
    const {
      service
    } = this;

    const list = await service.api.back.category.all();

    // 输出列表
    this.throwCorrect({
      list: list
    }, '查询成功');
  }

  /**
   * 获取单个分类
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        id: {
          n: '分类id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    // 查询分类
    const category = await service.api.back.category.findOne({
      _id: this.params.id
    });

    if (category) {
      this.throwCorrect(category);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = CategoryController;