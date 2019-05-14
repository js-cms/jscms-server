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
    async function getArticles(categoryId) {
      
    }

    // 获取所有分类
    let categories = await service.web.category.all();
    if (!categories) return this.notFound();

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const {
      subtitle,
      separator
    } = webConfig.site;
    
    this.setMeta({
      title: `最新文章（${pageSize}篇）${separator}${subtitle}`,
      keywords: `${subtitle}的最新文章（${pageSize}篇）`,
      description: `${subtitle}的最新文章（${pageSize}篇）`,
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'categories',
      // 页面别名：String
      widthType: 'full',
      // 分类数组: Array
      categories: categories || []
    });

    await this.render('/pages/categories', {});
  }
}

module.exports = CategoriesController;