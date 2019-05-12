/**
 * 自定义页面渲染器
 */

'use strict';

const BaseController = require('./base');

class PageController extends BaseController {

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
    const pageAlias = ctx.params[0] || '';

    //获取页面信息
    let page = await service.web.page.alias(pageAlias);

    if (!page) return this.notFound();

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const {
      subtitle,
      separator
    } = webConfig.site;
    
    this.setMeta({
      title: `${page.title}${separator}${subtitle}`,
      keywords: page.keywords,
      description: page.description
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'page' || 'unknown',
      // 页面别名：String
      pageAlias: pageAlias || 'unknown',
      // 自定义页面对象: String
      page: page || {}
    });

    await this.render('/pages/page', {});
  }

  /**
   * 自定义路由
   */
  async route() {
    return this.customRoute();
  }

}

module.exports = PageController;