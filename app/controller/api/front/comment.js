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
   * 新增评论
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: commentModel
    });

    let config = await service.api.front.config.alias('site');
    let site = config.info;
    if (site.boolCommentLogin) {
      if (!this.userId) this.throwError('请登陆后再评论');
    }

    let params = this.params;

    // 查找所属文章
    let article = await service.api.front.article.articleId(params.articleId);

    if (!article) this.throwError('文章不存在');

    // 赋值numberId
    params.articleNumberId = article.numberId;

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