'use strict';

const Controller = require('egg').Controller;

class TextController extends Controller {

  /**
   * sitemap.txt
   */
  async sitemap() {
    const { ctx, service } = this;
    const _articles = await service.article.findAll();
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
   * robots.txt
   */
  async robots() {
    const { ctx, service, config } = this;
    const findRes = await service.config.findOne({ 'alias': 'robots' });
    ctx.response.set('cache-control', 'no-cache');
    ctx.response.set('content-type', 'text/plain; charset=utf-8');
    ctx.body = findRes.info;
  }
}

module.exports = TextController;
