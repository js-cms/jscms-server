/**
 * 后台文章相关接口
 */

'use strict';

const BaseController = require('../base');
const marked = require('marked');
const _ = require('lodash');

const modelPath = `${process.cwd()}/app/model/proto`;
let articleModel = require(`${modelPath}/article`);

/**
 * 文章内容转化
 * @param {Object} params 文章对象
 */
const toContent = function name(params) {
  let contentType = Number(params.contentType);
  //内容转换
  switch (contentType) {
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
   * 创建文章
   */
  async create() {
    const {
      service
    } = this;
    await this.decorator({
      post: articleModel,
      toParams: {
        formField: true
      }
    });

    this.params.userId = this.userId;
    let params = this.params;

    //内容转换
    toContent(params);

    //numberId自增
    await service.api.back.config.numberId(params);

    //如果有分类名称，就查分类，并带入id
    await service.api.back.category.parseNameForArticle(params);

    //创建文章
    await service.api.back.article.create(this, true);

    //给分类增加文章数量
    await service.api.back.category.addNumForArticle(params);

    //更新标签列表
    await service.api.back.config.updateTagsForArticle(params);

    //输出
    this.throwCorrect({}, '文章创建成功');
  }

  /**
   * 更新文章
   */
  async update() {
    const {
      service
    } = this;
    let article = _.cloneDeep(articleModel);
    article.id = {
      n: '文章id',
      type: 'ObjectId',
      f: true,
      r: true
    };
    await this.decorator({
      post: article,
      toParams: {
        formField: true
      }
    });

    //内容转换
    toContent(this.params);

    //更新文章
    const updateRes = await service.api.back.article.update({
      _id: this.params.id
    }, this.params);

    //更新标签列表
    await service.config.updateTagsForArticle(this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '更新成功');
    } else {
      this.throwError('更新失败');
    }
  }

  /**
   * 快速更新文章
   */
  async fastUpdate() {
    const {
      service
    } = this;
    let article = {
      id: {
        n: '文章id',
        type: 'ObjectId',
        f: true,
        r: true
      }, // 文章id
      topType: {
        n: '置顶方式',
        type: 'Number',
        f: true,
        t: true,
        r: true,
        d: 0,
        extra: {
          comType: 'select',
          options: '0:无置顶,1:主要置顶,2:次要置顶'
        }
      }, // 置顶方式 0、无置顶 1、主要置顶 2、次要置顶
      categoryId: {
        n: '分类id',
        type: 'ObjectId',
        f: true,
        t: true,
        r: true,
        ref: 'Category',
        extra: {
          displayField: 'name',
          comType: 'select',
          options: 'categories'
        }
      }, // 所属分类对象
      title: {
        n: '文章标题',
        type: 'String',
        f: true,
        t: true,
        r: true,
        p: '文章的标题。'
      }, // 文章标题
      createTime: {
        n: '创建时间',
        type: 'Timestamp',
        f: true,
        t: true,
        r: true
      }, // 创建时间
      updateTime: {
        n: '更新时间',
        type: 'Timestamp',
        f: true,
        t: true,
        r: true
      } // 更新时间
    }

    await this.decorator({
      post: article,
      toParams: {
        formField: true
      }
    });

    //内容转换
    toContent(this.params);

    //更新文章
    const updateRes = await service.api.back.article.update({
      _id: this.params.id
    }, this.params);

    //更新标签列表
    await service.config.updateTagsForArticle(this.params);

    if (updateRes) {
      this.throwCorrect(updateRes, '更新成功');
    } else {
      this.throwError('更新失败');
    }
  }

  /**
   * 删除文章
   */
  async delete() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '文章id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const deleteRes = await service.api.back.article.remove({
      _id: this.params.id
    });

    if (deleteRes) {
      this.throwCorrect({}, '文章删除成功');
    } else {
      this.throwError('文章删除失败');
    }
  }

  /**
   * 获取文章列表
   */
  async list() {
    const {
      ctx,
      service
    } = this;
    await this.decorator({
      get: {
        categoryId: {
          n: '分类id',
          type: 'ObjectId',
          f: true,
          r: false
        },
        keyword: {
          type: 'String',
          f: true,
          r: false
        }
      }
    });

    let categoryId = this.params.categoryId || '';
    categoryId = categoryId.replace('null', '');
    const keyword = this.params.keyword;
    const {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    let queryAnd = [];
    if (categoryId) {
      queryAnd = [{
        categoryId: categoryId
      }];
    }

    //获取文章列表
    const {
      list,
      total
    } = await service.api.back.article.search({
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
   * 获取单篇文章
   */
  async show() {
    const {
      service
    } = this;
    await this.decorator({
      get: {
        id: {
          n: '文章id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    //查询文章
    const findArticle = await service.api.back.article.findOne({
      _id: this.params.id
    });

    if (findArticle) {
      this.throwCorrect(findArticle);
    } else {
      this.throwError('文章查询失败');
    }
  }
}

module.exports = ArticleController;
