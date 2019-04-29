'use strict';

const BaseController = require('./base');

class SearchController extends BaseController {

  /**
   * 搜索页
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
    let pageNumber = this.ctx.query.pageNumber || 1;
    let keyword = this.ctx.query.s;
    let pageSize = 10;

    if ( pageNumber < 1 ) {
      return this.notFound();
    }
    pageNumber = pageNumber - 1;

    let regKeyword = new RegExp(keyword, 'i'); //不区分大小写
    let whereOr = [];
    let where = {}
    if (keyword) {
      whereOr.push({
        title: { $regex: regKeyword }
      });
      whereOr.push({
        htContent: { $regex: regKeyword }
      });
    }
    if (whereOr.length) {
      where = {
        '$or': whereOr
      }
    }
    let articlesRes = await service.article.search(where, pageNumber, pageSize);
    let totalRes = await service.article.count(where);

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
        });
      } else if (index === pos) {
        pages.push({
          num: currentNum,
          isCurrent: true
        });
      } else if (afterNum <= totalNum && index > pos) {
        pages.push({
          num: afterNum,
          isCurrent: false
        });
      }
    });

    //重写页面元信息
    this.setMeta({
      title: `“${keyword}”的搜索结果${separator}${subtitle}`,
      keywords: keyword,
      description: `“${keyword}”的搜索结果${separator}${subtitle}`
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'search' || 'unknown',
      // 搜索关键字：String
      keyword: keyword || '',
      // 搜索结果文章列表：Array
      articles: articlesRes || [],
      // 分页信息：Object
      pagination: {
        prefix: `s?s=${keyword}`,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(totalRes / pageSize)
      }
    });

    //最后将搜索者信息和搜索信息插入搜索结果表
    await service.log.create({
      type: 2,
      info: {
        fullUrl: ctx.origin + ctx.url,
        params: ctx.query,
        searcherIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
        searcherReferer: ctx.headers['referer'],
        searcherUserAgent: ctx.headers['user-agent']
      }
    });

    await this.render('/pages/search', {});
  }

}

module.exports = SearchController;
