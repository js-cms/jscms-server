/**
 * 分类页渲染器
 */

'use strict';

const BaseController = require('./base');

class CategoryController extends BaseController {
  
  /**
   * 入口
   */
  async index() {
    // 初始化
    await this.init();
    // 加载处理器
    await this.handler();
  }

  /**
   * 处理器
   */
  async handler() {
    const {
      ctx,
      service
    } = this;
    let catAlias = ctx.params[0];
    let pageSize = 10;
    let pageNumber = ctx.params[1] ? ctx.params[1] - 1 : 0;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    if (pageNumber < 0) return this.notFound();

    let category = await service.web.category.alias(catAlias);

    if (!category) return this.customRoute();

    let articles = await service.web.article.list({
      categoryId: category._id
    }, pageNumber, pageSize);

    let total = await service.web.article.count({
      categoryId: category._id
    });

    // 分页算法
    let pages = this.paging(
      total,
      pageNumber,
      pageSize
    );

    // 元信息合并
    let webConfig = this.cache('WEB_CONFIG');
    const {
      separator,
      subtitle
    } = webConfig.site;
    let meta = {};
    let keywords = category.tags.join(',');
    if (category.isIndepMeta === true) {
      meta.title = category.indepMetaTitle || category.name;
      meta.keywords = category.indepMetaKeywords || keywords;
      meta.description = category.indepMetaDescription || category.intro;
    } else {
      meta.title = `${category.name}${separator}${subtitle}`;
      meta.keywords = keywords;
      meta.description = category.intro;
    }

    // 覆盖元信息
    this.setMeta(meta);

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'category' || 'unknown',
      // 分类英文别名: String
      catAlias: catAlias || '',
      // 分类对象: Object
      category: category || [],
      // 该分类的文章列表：Array
      articles: articles || [],
      // 分页信息：Object
      pagination: {
        prefix: catAlias,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(total / pageSize)
      }
    });

    await this.render('/pages/category', {});
  }

}

module.exports = CategoryController;