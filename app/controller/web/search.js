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
    let pageNumber = this.ctx.query.pageNumber - 1;
    pageNumber = isNaN(pageNumber) || pageNumber < 0 ? 0 : pageNumber;
    
    if ( pageNumber < 0 ) {
      return this.notFound();
    }
    
    let pageSize = 10;
    let keyword = this.ctx.query.s;

    let { articles, total } = await service.article.searchForWeb(keyword, pageNumber, pageSize);

    //分页算法
    let pages = this.paging(
      total,
      pageNumber,
      pageSize
    );

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
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
      articles: articles || [],
      // 分页信息：Object
      pagination: {
        prefix: `s?s=${keyword}`,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(total / pageSize)
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

    //显示搜索结果
    await this.render('/pages/search', {});
  }

}

module.exports = SearchController;
