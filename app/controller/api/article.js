'use strict';

const marked = require('marked');

const BaseController = require('./base');
const article = require('../../model/proto/article');

/**
 * 文章相关api
 */
class ArticleController extends BaseController {

  //点赞文章
  async like() {
    const { service } = this;
    this.decorator({ 
      post: {
        id: {type: 'ObjectId', f: true, r: true }
      }
    });

    const findArticle = await service.article.findOne({ _id: this.params.id });

    //给文章增加点赞数
    await service.article.updateOne({ _id: this.params.id }, {
      $inc: { likeCount: Number(1) }
    });

    this.throwCorrect({
      count: findArticle.likeCount + 1
    }, '点赞成功');
  }

  //新增文章
  async create() {
    const { ctx, service } = this;
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
    let newTags = ctx.helper.mixinArray(parameters.keywords, findTagsRes.info);
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
      return this.throwError('文章创建失败');
    }
  }

  //更新文章
  async update() {
    const { ctx, service } = this;
    this.decorator({
      login: true,
      post: article
    });

    if (this.params.mdContent) {
      this.params.htContent = marked(info.mdContent);
    }

    const updateRes = await service.article.update(
      { _id: this.params.id },
      this.params
    );

    if (this.params.keywords && this.params.keywords.length) {
      //更新标签列表
      let findTagsRes = await service.config.findOne({ alias: 'tags' });
      let newTags = ctx.helper.mixinArray(this.params.keywords, findTagsRes.info);
      await service.config.update({ _id: findTagsRes._id }, { info: newTags });
    }

    if (updateRes) {
      ctx.body = {
        code: 0,
        msg: '更新成功',
        data: updateRes
      };
    } else {
      return this.throwError('更新失败');
    }
  }

  //删除文章
  async delete() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return this.throwError('你没有登陆', 403);
    }

    const id = ctx.request.body.id;

    if (!id) {
      return this.throwError('参数错误');
    }

    const deleteRes = await service.article.remove({ _id: id });

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '文章删除完成'
      }
    } else {
      return this.throwError('文章删除失败');
    }
  }

  //获取文章列表
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return this.throwError('你没有登陆', 403);
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
      return this.throwError('你没有登陆', 403);
    }
    const id = ctx.query.id;
    if (!id) {
      return this.throwError('参数错误');
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
      return this.throwError('文章查询失败');
    }
  }
}

module.exports = ArticleController;
