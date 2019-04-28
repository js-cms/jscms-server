'use strict';

const marked = require('marked');

const BaseController = require('./base');
let comment = require('../../model/proto/comment');

/**
 * 评论相关api
 */
class CommentController extends BaseController {

  /**
   * @description 新增评论
   */
  async create() {
    const { service } = this;
    this.decorator({
      post: comment
    });

    let params = this.params;

    //查找所属文章
    let findArticleRes = await service.article.findOne({
      _id: params.articleId
    });

    if (!findArticleRes) {
      this.throwError('文章不存在');
    }

    //转化markdown代码
    if (params.mdContent) {
      params.htContent = marked(params.mdContent);
    }

    //创建评论
    let createCommentRes = await service.comment.create(params);

    if (createCommentRes._id) {
      //给文章增加评论数
      await service.article.update({ _id: findArticleRes._id }, {
        $inc: { commentCount: Number(1) }
      });
      this.throwCorrect(createCommentRes, '评论创建完成');
    } else {
      this.throwError('评论创建失败');
    }
  }

  /**
   * @description 更新评论
   */
  async update() {
    const { service } = this;
    comment.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      login: true,
      post: comment
    });

    if (this.params.mdContent) {
      this.params.htContent = marked(this.params.mdContent);
    }

    const updateRes = await service.comment.update({ _id: this.params.id }, this.params);

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
      login: true,
      get: {
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
   * @description 获取列表
   */
  async list() {
    const { ctx, service } = this;
    this.decorator({
      login: true
    });

    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    //获取评论列表
    const findCommentRes = await service.comment.find({}, pageNumber, pageSize);
    //获取文章总数
    const countCommentRes = await service.comment.count({});

    this.throwCorrect({
      list: findCommentRes,
      total: countCommentRes
    });
  }

  /**
   * @description 获取单个评论信息
   */
  async show() {
    const { service } = this;
    this.decorator({
      login: true,
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
