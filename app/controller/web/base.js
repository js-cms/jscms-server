'use strict';

const Controller = require('egg').Controller;
const utils = require('../main_handler/utils');

class BaseController extends Controller {

  async loadCommonData(data) {
    const { ctx, service, config } = this;
    const routerName = ctx.params.routerName || '';
    const pageType = utils.getType(routerName);

    //缓存页面类型
    this.cache('PAGE_TYPE', pageType);
     
    //最近三篇文章
    let recentlyArticlesRes = await service.article.find({}, 0, 3);
    //随机三篇文章
    let randomArticlesRes = await service.article.findRandom(3);
    //最近三条评论
    let recentlyCommentsRes = await service.comment.findByQuery({}, 0, 3);
    //获取浏览量最多的5篇文章
    let hotArticlesRes = await service.article.findByHot({}, 0, 5);
    //获取评论量最多的5篇文章
    let commentArticlesRes = await service.article.findByComment({}, 0, 5);

    //缓存模版数据
    this.cache('TEMPLAE_DATA', {
      recentlyArticles: recentlyArticlesRes,
      randomArticlesRes: randomArticlesRes,
      recentlyCommentsRes: recentlyCommentsRes,
      hotArticlesRes: hotArticlesRes,
      commentArticlesRes: commentArticlesRes
    });
  }

  //缓存方法
  cache(...argv) {
    this._cache = this._cache ? this._cache : {};
    if ( argv.length === 1 ) {
      return this._cache[argv[0]];
    } else if ( argv.length === 2 ) {
      this._cache[argv[0]] = argv[1];
    }
  }

  //404页面
  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}

module.exports = BaseController;
