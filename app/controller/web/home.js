'use strict';

const BaseController = require('./base');

class HomeController extends BaseController {

  /**
   * 首页
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
      service,
      config
    } = this;
    let pageSize = 10;
    let pageNumber = ctx.params[0] ? ctx.params[0] - 1 : 0;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    if (pageNumber < 0) {
      return this.notFound();
    }

    let topMainArticles = await service.article.find({
      topType: 1
    }, 0, 3);

    let topMinorArticles = await service.article.find({
      topType: 2
    }, 0, 2);

    let articles = await service.article.find({}, pageNumber, pageSize);
    let total = await service.article.count({});

    //分页算法
    let pages = this.paging(
      total,
      pageNumber,
      pageSize
    );

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const {
      title,
      separator,
      subtitle
    } = webConfig.site;
    this.setMeta({
      title: `${title}${separator}${subtitle}`
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'home' || 'unknown',
      // 文章列表：Array
      articles: articles,
      // 主要置顶文章：Array
      topMainArticles: topMainArticles || [],
      // 次要置顶文章：Array
      topMinorArticles: topMinorArticles || [],
      // 每页展示的文章数量：Number
      pageSize: pageSize || 0,
      // 当前页的页码：Number
      pageNumber: pageNumber || 0,
      // 分页信息：Object
      pagination: {
        prefix: 'index',
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(total / pageSize)
      }
    });

    await this.render('pages/index', {});
  }

}

module.exports = HomeController;