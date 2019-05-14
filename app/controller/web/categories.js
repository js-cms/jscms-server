/**
 * 最新指定数量文章页面渲染器
 */

'use strict';

const BaseController = require('./base');

class CategoriesController extends BaseController {

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
    const whiteList = ['index', 'normal', 'full'];
    let widthType = ctx.params[0];
    widthType = whiteList.includes(widthType) ? widthType : 'index';

    // 获取所有分类的文章 
    async function getArticles(categories) {
      let _categories = [];
      for (const cat of categories) {
        let _cat = cat._doc;
        let articles = await service.web.article.all({categoryId: cat._id});
        articles = articles.sort((i1, i2) => i2 - i1);
        _cat.articles = articles;
        _categories.push(_cat);
      }
      return _categories;
    }

    // 获取所有分类
    let categories = await service.web.category.all();
    if (!categories) return this.notFound();

    categories = await getArticles(categories);

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const {
      subtitle,
      separator
    } = webConfig.site;
    
    let title = '';
    if (widthType === 'index' || widthType === 'normal') {
      title = '专题分类列表页';
    } else if (widthType === 'full') {
      title = '全宽专题分类列表页';
    }
    
    this.setMeta({
      title: `${title}${separator}${subtitle}`,
      keywords: categories.map(i => i.name).splice(0, 5).join(','),
      description: `${title}`
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'categories',
      // 页面别名：String
      widthType: widthType,
      // 分类数组: Array
      categories: categories || []
    });

    await this.render('/pages/categories', {});
  }
}

module.exports = CategoriesController;