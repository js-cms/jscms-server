'use strict';

const BaseController = require('./base');

class CategoryController extends BaseController {

  /**
   * 分类页
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
    const { ctx, service } = this;
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
    let catAlias = ctx.params[0];
    let pageSize = 10;
    let pageNumber = ctx.params[1] ? ctx.params[1] - 1 : 0;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    if ( pageNumber < 0 ) {
      return this.notFound();
    }

    let findCategoryRes = await service.category.findOne({ alias: catAlias });

    if (!findCategoryRes) {
      return this.customRoute();
    }

    let articlesRes = await service.article.find({ categoryId: findCategoryRes._id }, pageNumber, pageSize);
    let totalRes = await service.article.count({ categoryId: findCategoryRes._id });

    let pages = [];
    let totalNum = Math.ceil(totalRes / pageSize);
    let showLen = 10;
    let pos = 3 - 1;
    Array.from({ length: showLen }).forEach((i, index) => {
      let beforNum = (pageNumber - (pos - index)) + 1;
      let currentNum = pageNumber + 1;
      let afterNum = (pageNumber + (index - pos)) + 1;
      if (beforNum > 0 && index < pos) {
        pages.push({
          num: beforNum,
          isCurrent: false
        })
      } else if (index === pos) {
        pages.push({
          num: currentNum,
          isCurrent: true
        })
      } else if (afterNum <= totalNum && index > pos) {
        pages.push({
          num: afterNum,
          isCurrent: false
        })
      }
    });

    //重写页面元信息
    this.setMeta({
      title: `${findCategoryRes.title}${(findCategoryRes.title ? ',' : '') + findCategoryRes.name}${separator}${subtitle}`,
      keywords: findCategoryRes.keywords,
      description: findCategoryRes.description
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'category' || 'unknown',
      // 分类英文别名: String
      catAlias: catAlias || '',
      // 分类对象: Object
      category: findCategoryRes || [],
      // 该分类的文章列表：Array
      articles: articlesRes || [],
      // 分页信息：Object
      pagination: {
        prefix: catAlias,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(totalRes / pageSize)
      }
    });

    await this.render('/pages/category', {});
  }

}

module.exports = CategoryController;
