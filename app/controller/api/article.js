'use strict';

const marked = require('marked');
const _ = require('lodash');

const BaseController = require('./base');
let articleModel = require('../../model/proto/article');

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

    this.params.userId = this.userId;
    let params = this.params;

    //内容转换
    toContent(params);

    //numberId自增
    await service.config.numberId(params);

    //如果有分类名称，就查分类，并带入id
    await service.category.parseNameForArticle(params);

    //创建文章
    await service.article.create(this, true);

    //给分类增加文章数量
    await service.category.addNumForArticle(params);

    //更新标签列表
    await service.config.updateTagsForArticle(params);

    //输出
    this.throwCorrect({}, '文章创建成功');
  }

  /**
   * @description 更新文章
   */
  async update() {
    const { ctx, service } = this;
    let article = _.cloneDeep(articleModel); 
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

    //更新标签列表
    await service.config.updateTagsForArticle(this.params);

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
        categoryId: { type: 'ObjectId', f: true, r: false },
        keyword: { type: 'String', f: true, r: false }
      }
    });

    let categoryId = this.params.categoryId || '';
    categoryId = categoryId.replace('null', '');
    const keyword = this.params.keyword;
    const { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    let queryAnd = [];
    if (categoryId) {
      queryAnd = [{
        categoryId: categoryId
      }];
    }

    //获取文章列表
    const { list, total } = await service.article.searchForApi({
      and: queryAnd,
      keyword: keyword,
      pageNumber: pageNumber,
      pageSize: pageSize
    });

    this.throwCorrect({
      list: list,
      total: total
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
