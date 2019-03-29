'use strict';

const BaseController = require('./base');

class HomeController extends BaseController {

  /**
   * 首页
   */
  async index() {
    await this.loadCommonData();
    await this.handler();
  }

  async handler() {
    const { ctx, service, config } = this;
    const renderType = this.cache('RENDER_TYPE');

    if (!isNaN(Number(renderType.value))) {
      if (renderType.value <= 0) {
        return this.notFound(opt);
      }
    }

    let pageSize = 10;
    let pageNumber = renderType.value - 1;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    let majorArticles = await service.article.find({
      topType: 1
    }, 0, 3);

    let secondaryArticles = await service.article.find({
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

    let data = {
      articles: articlesRes,
      majorArticles,
      secondaryArticles,
      pagination: {
        prefix: 'index',
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(totalRes / pageSize)
      }
    };
    await this.render('pages/index', data);
  }

}

module.exports = HomeController;
