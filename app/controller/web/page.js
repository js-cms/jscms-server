'use strict';

const BaseController = require('./base');

class PageController extends BaseController {

  /**
   * 自定义页面
   */
  async index() {
    // 初始化
    await this.init();
    // 加载处理器
    await this.handler();
  }

  async handler() {
    const { ctx, service, config } = this;
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
    const pageAlias = ctx.params[0] || '';

    //获取页面信息
    let findPageRes = await service.page.findOne({ alias: pageAlias });
    if (!findPageRes) {
      return this.notFound();
    }

    //重写页面元信息
    this.setMeta({
      title: `${findPageRes.title}${separator}${subtitle}`,
      keywords: findPageRes.keywords,
      description: findPageRes.description
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'page' || 'unknown',
      // 页面别名：String
      pageAlias: pageAlias || 'unknown',
      // 自定义页面对象: String
      page: findPageRes || {}
    });

    await this.render('/pages/page', {});
  }

}

module.exports = PageController;
