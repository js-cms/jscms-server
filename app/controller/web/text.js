/**
 * 文本文件渲染器
 */

'use strict';

const Controller = require('egg').Controller;

class TextController extends Controller {

  /**
   * 文件：sitemap.txt
   */
  async sitemap() {
    const {
      ctx,
      service
    } = this;
    
    const _articles = await service.web.article.all();
    let articles = '';
    _articles.forEach((item, index) => {
      let url = ctx.origin + '/' + item.numberId + '.html';
      articles = articles + url + (index < _articles.length - 1 ? '\n' : '');
    });
    ctx.response.set('cache-control', 'no-cache');
    ctx.response.set('content-type', 'text/plain; charset=utf-8');
    ctx.body = articles;
  }

  /**
   * 文件：robots.txt
   */
  async robots() {
    const {
      ctx,
      service
    } = this;

    const robotsConfig = await service.web.config.alias('robots');
    ctx.response.set('cache-control', 'no-cache');
    ctx.response.set('content-type', 'text/plain; charset=utf-8');
    ctx.body = robotsConfig.info;
  }
}

module.exports = TextController;