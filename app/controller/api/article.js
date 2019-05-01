'use strict';

const marked = require('marked');

const BaseController = require('./base');
let article = require('../../model/proto/article');

/**
 * 文章内容转化
 * @param {Object} params 文章对象
 */
const toContent = function name(params) {
  //内容转换
  switch (params.contentType) {
    case 0: //markdown
      if (params.mdContent) {
        params.content = marked(params.mdContent);
      }
      break;
    case 1: //html
      if (params.htmlContent) {
        params.content = params.htmlContent;
      }
      break;
    case 2: //richtext
      if (params.richContent) {
        params.content = params.richContent;
      }
      break;
    default:
      break;
  }
}

class ArticleController extends BaseController {

  /**
   * @description 点赞某个文章
   */
  async like() {
    const { service } = this;
    this.decorator({
      post: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const findArticle = await service.article.findOne({ _id: this.params.id });

    //给文章增加点赞数
    await service.article.updateOne({ _id: this.params.id }, {
      $inc: { likeTotal: Number(1) }
    });

    this.throwCorrect({
      count: findArticle.likeTotal + 1
    }, '点赞成功');
  }

  /**
   * @description 创建文章
   */
  async create() {
    const { ctx, service } = this;
    this.decorator({
      login: true,
      post: article,
      toParams: { formField: true }
    });

    //统计文章数量
    let findConfig = await service.config.findOne({ alias: 'articleCount' });
    let numberId = Number(findConfig.info.num) + 1;
    await service.config.update({ _id: findConfig._id }, {
      info: { num: numberId }
    });

    let params = this.params;
    params.numberId = numberId;
    params.userId = this.userId;

    //内容转换
    toContent(params);

    //如果有分类名称，就查分类，并带入id
    if (params.categoryName) {
      let findCatRes = await service.category.findOne({
        name: params.categoryName
      });
      params.categoryId = findCatRes._id;
      delete params.categoryName;
    }

    //创建文章
    const createArticleRes = await service.article.create(params);

    //给分类增加文章
    const updateCategoryRes = await service.category.update({ _id: params.categoryId }, {
      $inc: { articleCount: Number(1) }
    });

    //更新标签列表
    let findTagsRes = await service.config.findOne({ alias: 'tags' });
    let newTags = ctx.helper.mixinArray(params.keywords, findTagsRes.info);
    await service.config.update({ _id: findTagsRes._id }, {
      info: newTags
    });

    //如果文章添加成功
    if (createArticleRes._id && updateCategoryRes) {
      this.throwCorrect(createArticleRes, '文章创建成功');
    } else {
      this.throwError('文章创建失败');
    }
  }

  /**
   * @description 更新文章
   */
  async update() {
    const { ctx, service } = this;
    article.id = { type: 'ObjectId', f: true, r: true };
    this.decorator({
      login: true,
      post: article,
      toParams: { formField: true }
    });

    //内容转换
    toContent(this.params);

    //更新文章
    const updateRes = await service.article.update({ _id: this.params.id }, this.params);

    if (this.params.keywords && this.params.keywords.length) {
      //更新标签列表
      let findTagsRes = await service.config.findOne({ alias: 'tags' });
      let newTags = ctx.helper.mixinArray(this.params.keywords, findTagsRes.info);
      await service.config.update({ _id: findTagsRes._id }, { info: newTags });
    }

    if (updateRes) {
      this.throwCorrect(updateRes, '更新成功');
    } else {
      this.throwError('更新失败');
    }
  }

  /**
   * @description 删除文章
   */
  async delete() {
    const { service } = this;
    this.decorator({
      login: true,
      get: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const deleteRes = await service.article.remove({ _id: this.params.id });

    if (deleteRes) {
      this.throwCorrect({}, '文章删除成功');
    } else {
      this.throwError('文章删除失败');
    }
  }

  /**
   * @description 获取文章列表
   */
  async list() {
    const { ctx, service } = this;
    this.decorator({
      login: true,
      get: {
        categoryId: { type: 'ObjectId', f: true, r: true },
        keyword: { type: 'String', f: true, r: true }
      }
    });

    const categoryId = this.params.categoryId;
    const keyword = this.params.keyword;

    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    let reg = new RegExp(keyword, 'i'); //不区分大小写

    let whereAnd = [];
    let where = {}
    if (categoryId && categoryId != 0) {
      whereAnd.push({
        categoryId
      });
    }
    if (keyword) {
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

    this.throwCorrect({
      list: findArticleRes,
      total: countArticleRes
    }, '查询成功');
  }

  /**
   * @description 获取单篇文章
   */
  async show() {
    const { service } = this;
    this.decorator({
      login: true,
      get: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    //查询文章
    const findArticle = await service.article.findOne({ _id: this.params.id });

    if (findArticle) {
      this.throwCorrect(findArticle);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = ArticleController;
