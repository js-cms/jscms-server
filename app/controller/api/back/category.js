/**
 * 后台分类相关接口
 */

'use strict';

const marked = require('marked');

const BaseController = require('../base');
let category = require('../../../model/proto/category');

class CategoryController extends BaseController {

	/**
   * @description 创建分类
   */
  async create() {
    const { service } = this;
    this.decorator({
      post: category,
      toParams: { formField: true }
    });
    
    let params = this.params;

    //查找分类
    let findRes = await service.category.findOne({
      name: params.name,
      alias: params.alias
    });

    //判断是否存在重复分类
    if (findRes) {
      this.throwError('分类已存在');
    }

    //分类创建结果
    const createCatRes = await service.category.create(params);

    if (createCatRes._id) {
      this.throwCorrect(createCatRes, '分类创建完成');
    } else {
      this.throwError('分类创建失败');
    }
  }

	/**
   * @description 更新分类
   */
  async update() {
    const { service } = this;
    category.id = { n: '分类id', type: 'ObjectId', f: true, r: true };
    this.decorator({
      post: category,
      toParams: { formField: true }
    });

    const updateRes = await service.category.update({_id: this.params.id}, this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '分类更新成功');
    } else {
      this.throwError('分类更新失败');
    }
  }

	/**
   * @description 删除分类
   */
  async delete() {
    const { service } = this;
    this.decorator({
      post: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const deleteRes = await service.category.remove({_id: this.params.id});

    if (deleteRes) {
      this.throwCorrect({}, '分类删除完成');
    } else {
      this.throwError('分类创建失败');
    }
  }

	/**
   * @description 获取分类列表
   */
  async list() {
    const { service } = this;
    this.decorator({
      login: true
    });

    //获取分类列表
    const findCategoryRes = await service.category.find({});

    if (findCategoryRes) {
      this.throwCorrect(findCategoryRes);
    } else {
      this.throwError('分类创建失败');
    }
  }

	/**
   * @description 获取单个分类
   */
  async show() {
    const { service } = this;
    this.decorator({
      get: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    //获取文章
    const findRes = await service.category.findOne({ _id: this.params.id });

    if (findRes) {
      this.throwCorrect(findRes);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = CategoryController;
