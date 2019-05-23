/**
 * 前台评论相关的api接口
 */

'use strict';

const BaseController = require('../base');
const marked = require('marked');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let commentModel = require(`${modelPath}/comment`);

class CommentController extends BaseController {

  /**
   * 获取评论列表
   */
  async list() {
    const { ctx, service } = this;
    await this.decorator({
      get: {
        numberId: {
          n: '文章NumberId',
          type: 'Number',
          f: true,
          r: true
        }
      }
    });
    
    const {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    //获取评论的列表
    const list = await service.api.front.comment.list({articleNumberId: this.params.numberId}, pageNumber, pageSize);
    const total = await service.api.front.comment.count({articleNumberId: this.params.numberId});

    this.throwCorrect({
      list: list,
      total: total
    });
  }

  /**
   * 新增评论
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        articleNumberId: { n: '所属文章序号', type: 'Number', f: true, t: true, r: true }, // 所属文章序号
        mdContent: { n: '评论内容', type: 'String', f: true, t: false, r: true } // 评论的markdown内容
      }
    });

    let userId = this.userId; 
    let config = await service.api.front.config.alias('site');
    let site = config.info;
    if (site.boolCommentLogin) {
      if (!userId) this.throwError('请登陆后再评论');
    } else {
      if (!userId) userId = '5c9648d94a4cf500067b6770';
    }

    let params = this.params;

    // 查找用户
    let user = await service.api.front.user.userId(userId);
    if (!user) this.throwError('用户不存在');

    // 查找所属文章
    let article = await service.api.front.article.numberId(params.articleNumberId);
    if (!article) this.throwError('文章不存在');

    // 赋值
    params.articleId = article._id;
    params.userId = userId;

    // 转化markdown代码
    if (params.mdContent) params.htContent = marked(params.mdContent);

    // 创建评论
    let createRes = await service.api.front.comment.create(params);

    if (createRes._id) {
      // 给文章增加评论数
      await service.api.front.article.updateComment(article._id);
      this.throwCorrect(createRes, '评论创建完成');
    } else {
      this.throwError('评论创建失败');
    }
  }
}

module.exports = CommentController;