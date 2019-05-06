'use strict';

const BaseController = require('./base');

class TagsController extends BaseController {

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
    const { ctx, service } = this;
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
    let { tagName, pageNumber } = this.toStructure(ctx.params.tagName);
    let pageSize = 10;
    
    if ( pageNumber < 0 ) {
      return this.notFound();
    }
    
    let query = {
      keywords:{ $elemMatch:{ $eq: tagName } }
    };
    let articles = await service.article.find(query, pageNumber, pageSize);
    let total = await service.article.count(query);

    //重写页面元信息
    this.setMeta({
      title: `${tagName}相关的文章${separator}${subtitle}`,
      keywords: tagName,
      description: `${tagName}相关的文章${separator}${subtitle}`
    });

    //分页算法
    let pages = this.paging(
      total,
      pageNumber,
      pageSize
    );

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'tag' || 'unknown',
      // 分类英文别名: String
      tagName: tagName || '',
      // 该标签的文章列表：Array
      articles: articles || [],
      // 分页信息：Object
      pagination: {
        prefix: `tags/${tagName}`,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(total / pageSize)
      }
    });

    await this.render('/pages/tags', {});
  }

  /**
   * @description 解析参数结构
   * @param {Object} params 
   */
  toStructure(params) {
    let tempArr = params.split('-');
    let tagName = tempArr[0].replace('.html', '');
    let pageNumber = tempArr[1] || '0.html';
    pageNumber = Number(pageNumber.replace('.html', '')) - 1;
    pageNumber = isNaN(pageNumber) || pageNumber < 0 ? 0 : pageNumber;
    return {
      tagName: tagName,
      pageNumber: pageNumber
    }
  }
}

module.exports = TagsController;
