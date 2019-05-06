/**
 * 后台评论相关接口
 */

'use strict';

const marked = require('marked');
const _ = require('lodash');

const BaseController = require('../base');
let commentModel = require('../../../model/proto/comment');

class CommentController extends BaseController {

  /**
   * @description 新增评论（网站前端接口）
   */
  async webcreate() {
    const { service } = this;
    this.decorator({
      post: commentModel
    });
    let params = this.params;
    
    //查找所属文章
    let article = await service.article.findOne({ _id: params.articleId});
    if (!article) this.throwError('文章不存在');

    //赋值numberId
    params.articleNumberId = article.numberId;

    //转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    //创建评论
    let createRes = await service.comment.create(params);

    if (createRes._id) {
      //给文章增加评论数
      await service.article.update({ _id: article._id }, {
        $inc: { commentTotal: Number(1) }
      });
      this.throwCorrect(createRes, '评论创建完成');
    } else {
      this.throwError('评论创建失败');
    }
  }

  /**
   * @description 创建评论（管理员接口）
   */
  async create() {
    const { service } = this;
    this.decorator({
      post: commentModel,
      toParams: { formField: true }
    });

    let params = this.params;

    //查找所属文章
    let article = await service.article.findOne({ numberId: params.articleNumberId });
    if (!article) this.throwError('文章不存在');

    //赋值文章id
    params.articleId = article._id;

    //转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    //创建评论
    let createRes = await service.comment.create(params);

    if (createRes._id) {
      //给文章增加评论数
      await service.article.update({ _id: article._id }, {
        $inc: { commentTotal: Number(1) }
      });
      this.throwCorrect(createRes, '评论创建完成');
    } else {
      this.throwError('评论创建失败');
    }
  }

  /**
   * @description 更新评论
   */
  async update() {
    const { service } = this;
    let comment = _.cloneDeep(commentModel);
    comment.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      post: comment,
      toParams: { formField: true }
    });

    let params = this.params;

    //查找所属文章
    let article = await service.article.findOne({ numberId: params.articleNumberId });
    if (!article) this.throwError('文章不存在');

    //赋值文章id
    params.articleId = article._id;

    //转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    const updateRes = await service.comment.update({ _id: params.id }, params);

    if (updateRes) {
      this.throwCorrect(updateRes, '评论更新成功');
    } else {
      this.throwError('评论更新失败');
    }
  }

  /**
   * @description 删除评论
   */
  async delete() {
    const { service } = this;
    this.decorator({
      post: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const deleteRes = await service.comment.remove({ _id: this.params.id });

    if (deleteRes) {
      this.throwCorrect({}, '评论删除完成');
    } else {
      this.throwError('评论删除失败');
    }
  }

  /**
   * @description 获取列表（管理员接口）
   */
  async list() {
    const { ctx, service } = this;
    this.decorator({
      get: {
        keyword: { type: 'String', f: true, r: false }
      }
    });
    const keyword = this.params.keyword;
    const { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    //获取文章列表
    const { list, total } = await service.comment.searchForApi({
      and: [],
      keyword: keyword,
      pageNumber: pageNumber,
      pageSize: pageSize
    });

    this.throwCorrect({
      list: list,
      total: total
    });
  }

  /**
   * @description 获取单个评论信息
   */
  async show() {
    const { service } = this;
    this.decorator({
      get: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    //查询评论
    const findRes = await service.category.findOne({ _id: this.params.id });

    if (findRes) {
      this.throwCorrect(findRes);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = CommentController;
