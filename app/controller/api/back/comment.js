/**
 * 后台评论相关接口
 */

'use strict';

const BaseController = require('../base');
const marked = require('marked');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let commentModel = require(`${modelPath}/comment`);

class CommentController extends BaseController {

  /**
   * 创建评论
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: commentModel,
      toParams: {
        formField: true
      }
    });

    let params = this.params;

    //查找所属文章
    let article = await service.api.back.article.findOne({
      numberId: params.articleNumberId
    });
    if (!article) this.throwError('文章不存在');

    //赋值文章id
    params.articleId = article._id;

    //转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    //创建评论
    let createRes = await service.api.back.comment.create(params);

    if (createRes._id) {
      //给文章增加评论数
      await service.api.back.article.update({
        _id: article._id
      }, {
        $inc: {
          commentTotal: Number(1)
        }
      });
      this.throwCorrect(createRes, '评论创建完成');
    } else {
      this.throwError('评论创建失败');
    }
  }

  /**
   * 更新评论
   */
  async update() {
    const {
      service
    } = this;
    let comment = _.cloneDeep(commentModel);
    comment.id = {
      n: '评论id',
      type: 'ObjectId',
      f: true,
      r: true
    };
    await this.decorator({
      post: comment,
      toParams: {
        formField: true
      }
    });

    let params = this.params;

    //查找所属文章
    let article = await service.api.back.article.findOne({
      numberId: params.articleNumberId
    });
    if (!article) this.throwError('文章不存在');

    //赋值文章id
    params.articleId = article._id;

    //转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    const updateRes = await service.api.back.comment.update({
      _id: params.id
    }, params);

    if (updateRes) {
      this.throwCorrect(updateRes, '评论更新成功');
    } else {
      this.throwError('评论更新失败');
    }
  }

  /**
   * 删除评论
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '评论id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const deleteRes = await service.api.back.comment.remove({
      _id: this.params.id
    });

    if (deleteRes) {
      this.throwCorrect({}, '评论删除完成');
    } else {
      this.throwError('评论删除失败');
    }
  }

  /**
   * 获取列表
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
    } = await service.api.back.comment.search({
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
   * 获取单个评论信息
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        id: {
          n: '评论id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    //查询评论
    const comment = await service.api.back.comment.findOne({
      _id: this.params.id
    });

    if (comment) {
      this.throwCorrect(comment);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = CommentController;