'use strict';

const Controller = require('egg').Controller;

class TextController extends Controller {

  /**
   * sitemap.txt
   */
  async sitemap() {
    const { ctx, service, config } = this;
    const _articles = await service.article.findAll();
    let articles = "";
    _articles.forEach((item, index) => {
      let url = ctx.origin + "/" + item.serialNumber + ".html";
      articles = articles + url + (index < _articles.length - 1 ? "\n" : "");
    });
    ctx.body = articles;
  }

  /**
   * robots.txt
   */
  async robots() {
    const { ctx, service, config } = this;
    ctx.body = `# robots.txt
User-agent: *
Disallow: 
`;
  }
}

module.exports = TextController;
