'use strict';

const marked = require('marked');

const BaseController = require('./base');
const article = require('../../model/proto/article');

// 数组混合
const mixinArray = function (arr1, arr2) {
  let _arr2 = arr2 ? arr2 : [];
  let newArr = arr1.concat(_arr2);
  return [...new Set(newArr)];
}

/**
 * 文章相关api
 */
class ArticleController extends BaseController {

  //点赞文章
  async like() {
    const { ctx, service, config } = this;
    let params = {
      id: {
        type: 'ObjectId',
        errorMsg: '参数不正确'
      }
    };
    this.decorator({ post: params });

    const findArticle = await service.article.findOne({ _id: params.id });

    //给文章增加点赞数
    await service.article.updateOne({ _id: params.id }, {
      $inc: { likeCount: Number(1) }
    });

    this.throwCorrect({
      count: findArticle.likeCount + 1
    }, '点赞成功');
  }

  //新增文章
  async create() {
    const { ctx, service, config } = this;
    this.decorator({
      login: true,
      post: article
    });

    //统计文章数量
    let configCountRes = await service.config.findOne({ alias: 'articleCount' });
    let num = Number(configCountRes.info.num) + 1;
    await service.config.update({
      _id: configCountRes._id
    }, {
      info: { num: num }
    });

    let parameters = this.params;
    parameters.numberId = num;

    //文章创建结果
    parameters.htContent = marked(parameters.mdContent);
    parameters.userId = this.userId;

    //如果有分类名称，就查分类，并带入id
    if (parameters.categoryName) {
      let findCatRes = await service.category.findOne({
        name: parameters.categoryName
      });
      parameters.categoryId = findCatRes._id;
      delete parameters.categoryName;
    }

    //创建文章
    const createArticleRes = await service.article.create(parameters);

    //给分类增加文章
    const updateCategoryRes = await service.category.update(
      {
        _id: parameters.categoryId
      },
      {
        $inc: { articleCount: Number(1) }
      }
    );

    //更新标签列表
    let findTagsRes = await service.config.findOne({ alias: 'tags' });
    let newTags = mixinArray(parameters.keywords, findTagsRes.info);
    await service.config.update({
      _id: findTagsRes._id
    }, {
      info: newTags
    });

    //如果文章添加成功
    if (createArticleRes._id && updateCategoryRes) {
      // 设置响应体和状态码
      ctx.body = {
        code: 0,
        msg: '文章创建成功',
        data: createArticleRes
      };
    } else {
      return ctx.helper.throwError(ctx, '文章创建失败');
    }
  }

  //更新文章
  async update() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    let info = ctx.request.body;
    if (info.mdContent) {
      info.htContent = marked(info.mdContent);
    }

    const updateRes = await service.article.update(
      { _id: id },
      info
    );

    if (info.keywords && info.keywords.length) {
      //更新标签列表
      let findTagsRes = await service.config.findOne({ alias: 'tags' });
      let newTags = mixinArray(info.keywords, findTagsRes.info);
      let saveTagsRes = await service.config.update({
        _id: findTagsRes._id
      }, {
          info: newTags
        });
    }

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

  //删除文章
  async delete() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    const deleteRes = await service.article.remove({ _id: id });

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '文章删除完成'
      }
    } else {
      return ctx.helper.throwError(ctx, '文章删除失败');
    }
  }

  //获取文章列表
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const categoryId = ctx.query.categoryId;
    const keyword = ctx.helper.escape(ctx.query.keyword);
    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    let reg = new RegExp(keyword, 'i'); //不区分大小写

    let whereAnd = [];
    let where = {}
    if (categoryId && categoryId != 0) {
      whereAnd.push({
        categoryId: categoryId
      });
    }
    if (ctx.query.keyword) {
      whereAnd.push({
        title: { $regex: reg }
      });
    }
    if (whereAnd.length) {
      where = {
        '$and': whereAnd
      }
    }

    //获取文章列表
    const findArticleRes = await service.article.search(where, pageNumber, pageSize);
    //获取文章总数
    const countArticleRes = await service.article.count(where);

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        list: findArticleRes,
        total: countArticleRes
      }
    };
  }

  //获取单个文章信息
  async show() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const id = ctx.query.id;
    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    //获取文章
    const findArticleRes = await service.article.findOne({ _id: id });

    if (findArticleRes) {
      ctx.body = {
        code: 0,
        msg: '查询成功',
        data: findArticleRes
      };
    } else {
      return ctx.helper.throwError(ctx, '文章查询失败');
    }
  }
}

module.exports = ArticleController;
