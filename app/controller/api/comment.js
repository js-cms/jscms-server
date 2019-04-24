'use strict';

const Controller = require('egg').Controller;
const marked = require('marked');

/**
 * 评论相关api
 */
class CommentController extends Controller {

  //新增评论
  async create() {
    const { ctx, service } = this;
    let parameters = ctx.request.body;

    if (!parameters.articleId) {
      return ctx.helper.throwError(ctx, '缺少参数');
    }

    //查找所属文章
    let findArticleRes = await service.article.findOne({
      _id: parameters.articleId
    });

    if (!findArticleRes) {
      return ctx.helper.throwError(ctx, '文章不存在');
    }

    if (parameters.mdContent) {
      parameters.htContent = marked(parameters.mdContent);
    }

    //创建评论
    let createCommentRes = await service.comment.create(parameters);

    if (createCommentRes._id) {
      //给文章增加评论数
      const updateArticleRes = await service.article.update(
        {
          _id: findArticleRes._id
        },
        {
          $inc: { commentCount: Number(1) }
        }
      );
    }

    if (createCommentRes._id) {
      ctx.body = {
        code: 0,
        msg: '评论创建完成',
        data: createCommentRes
      }
    } else {
      return ctx.helper.throwError(ctx, '评论创建失败');
    }
  }

  //更新评论
  async update() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const id = ctx.request.body._id;
    let info = ctx.request.body;

    delete info._id;
    delete info.createTime;
    delete info.updateTime;

    if (info.mdContent) {
      info.htContent = marked(info.mdContent);
    }

    const updateRes = await service.comment.update({_id: id}, info);
    if (updateRes) {
      ctx.body = {
        code: 0,
        msg: '更新成功',
        data: updateRes
      };
    } else {
      return ctx.helper.throwError(ctx, '更新失败');
    }
  }

  //删除评论
  async delete() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    const deleteRes = await service.comment.remove({ _id: id });

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '评论删除完成'
      }
    } else {
      return ctx.helper.throwError(ctx, '评论删除失败');
    }
  }

  //获取评论列表
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    //获取评论列表
    const findCommentRes = await service.comment.find({}, pageNumber, pageSize);
    //获取文章总数
    const countCommentRes = await service.comment.count({});

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        list: findCommentRes,
        total: countCommentRes
      }
    };
  }

  //获取单个评论信息
  async show() {
    const { ctx, service, config } = this;
    ctx.body = 'hi!';
  }
}

module.exports = CommentController;