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

  async handler() {
    const { ctx, service, config } = this;
    let pageSize = 10;
    let pageNumber = ctx.params[0] ? ctx.params[0] - 1 : 0;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    if ( pageNumber < 0 ) {
      return this.notFound();
    }

    let topMainArticles = await service.article.find({
      topType: 1
    }, 0, 3);

    let topMinorArticles = await service.article.find({
      topType: 2
    }, 0, 2);

    let articlesRes = await service.article.find({}, pageNumber, pageSize);
    let totalRes = await service.article.count({});

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

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'home' || 'unknown',
      // 文章列表：Array
      articles: articlesRes,
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
        end: Math.ceil(totalRes / pageSize)
      }
    });
    
    await this.render('pages/index', {});
  }

}

module.exports = HomeController;
