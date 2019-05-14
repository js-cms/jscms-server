/**
 * 最新指定数量文章页面渲染器
 */

'use strict';

const BaseController = require('./base');

class LatestController extends BaseController {

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
    const pageSize = Number(ctx.params[0]) || 0;

    //获取页面信息
    let articles = await service.web.article.list({}, 0, pageSize);

    if (!articles) return this.notFound();

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
      pageType: 'latest',
      // 页面别名：String
      pageSize: pageSize || 0,
      // 文章数组: Array
      articles: articles || []
    });

    await this.render('/pages/latest', {});
  }

}

module.exports = LatestController;