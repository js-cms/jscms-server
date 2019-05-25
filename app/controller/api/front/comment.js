/**
 * 前台评论相关的api接口
 */

'use strict';

const xss = require('xss');
const marked = require('marked');
const _ = require('lodash');

const BaseController = require('../base');
const modelPath = `${process.cwd()}/app/model/proto`;
let commentModel = require(`${modelPath}/comment`);

class CommentController extends BaseController {
  
  /**
   * 获取评论配置
   */
  async conf() {
    const { service } = this;
    const comment = await service.api.front.config.alias('comment');
    const site = await service.api.front.config.alias('site');
    let config = Object.assign(comment.info, {
      boolCommentLogin: site.info.boolCommentLogin,
      currentUser: await this.uinfo(true)
    });
    this.throwCorrect(config);
  }

  /**
   * 获取评论列表
   */
  async list() {
    const { ctx, service } = this;
    await this.decorator({
      get: {
        numberId: {
          n: '所属文章序号',
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
    const _firstLevelList = await service.api.front.comment.firstLevelList({articleNumberId: this.params.numberId}, pageNumber, pageSize);
    const firstLevelTotal = await service.api.front.comment.firstLevelCount({articleNumberId: this.params.numberId});
    let firstLevelList = [];

    //获取二级评论
    for (const item of _firstLevelList) {
      let newItem = item._doc;
      let childrenList = await service.api.front.comment.list({
        commentId: item._id,
        articleNumberId: this.params.numberId
      }, 0, 3);
      let childrenTotal = await service.api.front.comment.count({
        commentId: item._id,
        articleNumberId: this.params.numberId
      });
      newItem.children = {
        list: childrenList,
        total: childrenTotal
      }
      firstLevelList.push(newItem);
    }

    this.throwCorrect({
      list: firstLevelList,
      total: firstLevelTotal
    });
  }

  /**
   * 获取子评论列表
   */
  async childlist() {
    const { ctx, service } = this;
    await this.decorator({
      get: {
        commentId: { n: '所属评论Id', type: 'String', f: true, t: true, r: true }, // 所属评论Id
        numberId: { n: '所属文章序号', type: 'Number', f: true, r: true } // 所属文章的id
      }
    });
    
    const {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    // 获取子评论的列表
    const list = await service.api.front.comment.list({
      commentId: this.params.commentId,
      articleNumberId: this.params.numberId
    }, pageNumber, pageSize);
    const total = await service.api.front.comment.count({
      commentId: this.params.commentId,
      articleNumberId: this.params.numberId
    });

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
      service,
      config
    } = this;
    await this.decorator({
      post: {
        repliedUserId: { n: '被回复用户的Id', type: 'String', f: true, t: true, r: false }, // 被回复用户的Id
        commentId: { n: '所属评论Id', type: 'String', f: true, t: true, r: false }, // 所属评论Id
        numberId: { n: '所属文章序号', type: 'Number', f: true, t: true, r: true }, // 所属文章序号
        mdContent: { n: '评论内容', type: 'String', f: true, t: false, r: true } // 评论的markdown内容
      }
    });
    let userId = this.userId;
    let siteConfig = await service.api.front.config.alias('site');
    let site = siteConfig.info;
    if (site.boolCommentLogin) {
      if (!userId) this.throwError('请登陆后再评论');
    } else {
      if (!userId) userId = config.constant.anonymousUserId;
    }

    let params = this.params;

    // 查找用户
    let user = await service.api.front.user.userId(userId);
    let repliedUser = {};
    if (!user) this.throwError('用户不存在');
    if (params.repliedUserId) {
      repliedUser = await service.api.front.user.userId(params.repliedUserId);
    }

    // 查找所属文章
    let article = await service.api.front.article.numberId(params.numberId);
    if (!article) this.throwError('文章不存在');

    // 赋值
    params.articleNumberId = params.numberId;
    params.articleId = article._id;
    params.userAuthor = {
      id: user._id,
      nickname: user.nickname,
      avatar: user.avatar
    };
    params.userReplied = {
      id: repliedUser._id,
      nickname: repliedUser.nickname,
      avatar: repliedUser.avatar
    };
    params.likeUserIds = [];

    // 查询所属评论
    if (params.commentId) {
      let comment = await service.api.front.comment.findOne({_id: params.commentId});
      if (comment.commentId) {
        params.commentId = comment.commentId;
      } else {
        params.userReplied = {};
      }
    } else {
      params.commentId = '';
    }

    // 转化markdown代码，并过滤潜在的会导致xss攻击的代码。
    if (params.mdContent) params.htContent = marked(xss(params.mdContent));

    // 计算 numberId
    let numberId = 0;
    if (params.commentId) {
      let childrenTotal = await service.api.front.comment.count({
        commentId: params.commentId,
        articleNumberId: this.params.numberId
      });
      numberId = childrenTotal + 1;
    } else {
      let fristLevelTotal = await service.api.front.comment.firstLevelCount({
        articleNumberId: this.params.numberId
      });
      numberId = fristLevelTotal + 1;
    }
    params.numberId = numberId;

    // 创建评论
    let createRes = await service.api.front.comment.create(params);

    if (createRes._id) {
      // 给文章增加评论数 
      await service.api.front.article.updateComment(article._id);
      // 给父评论增加评论回复数
      if (params.commentId) await service.api.front.comment.updateReplyTotal(params.commentId);
      this.throwCorrect(createRes, '评论成功');
    } else {
      this.throwError('评论失败，未知错误。');
    }
  }
}

module.exports = CommentController;