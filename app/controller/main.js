'use strict';

const BaseController = require('./web/base');
const utils = require('./main_handler/utils');
const handlers = require('./main_handler/index'); //处理器

class MainController extends BaseController {

  //首页
  async index() {
    const { ctx, service, config } = this;
    await this.loadCommonData();
 
    this.publicData = this.cache('TEMPLAE_DATA');
    let res = this.cache('PAGE_TYPE');

    await handlers[res.type].call(this, {
      ctx, service, config,
      typeObj: res
    });
  }

  //作者
  async author() {
    const { ctx, service, config } = this;
    let pNickname = ctx.params.nickname || '';
    let temp = pNickname.replace(".html", "");
    let tempArr = temp.split("-");
    let nickname = tempArr[0] || "";
    let pageNum = tempArr[1];

    const res = {
      type: "author",
      nickname: nickname,
      pageNum: pageNum
    }

    let publicDdata = {};
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

    this.publicData = {
      recentlyArticles: recentlyArticlesRes,
      randomArticlesRes: randomArticlesRes,
      recentlyCommentsRes: recentlyCommentsRes,
      hotArticlesRes: hotArticlesRes,
      commentArticlesRes: commentArticlesRes
    }

    if (!isNaN(Number(pageNum))) {
      if (pageNum <= 0) {
        return this.notFound({ ctx, service, config });
      }
    }
    if (!nickname) {
      return this.notFound({ ctx, service, config });
    }

    await handlers[res.type].call(this, {
      ctx, service, config,
      typeObj: res
    });
  }

  //标签
  async tags() {
    const { ctx, service, config } = this;
    let pTagName = ctx.params.tagName || '';
    let temp = pTagName.replace(".html", "");
    let tempArr = temp.split("-");
    let tagName = tempArr[0] || "";
    let pageNum = tempArr[1];

    const res = {
      type: "tags",
      tagName: tagName,
      pageNum: pageNum
    }

    let publicDdata = {};
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

    this.publicData = {
      recentlyArticles: recentlyArticlesRes,
      randomArticlesRes: randomArticlesRes,
      recentlyCommentsRes: recentlyCommentsRes,
      hotArticlesRes: hotArticlesRes,
      commentArticlesRes: commentArticlesRes
    }

    if (!isNaN(Number(pageNum))) {
      if (pageNum <= 0) {
        return this.notFound({ ctx, service, config });
      }
    }
    if (!tagName) {
      return this.notFound({ ctx, service, config });
    }

    await handlers[res.type].call(this, {
      ctx, service, config,
      typeObj: res
    });
  }

  //自定义页面
  async page() {
    const { ctx, service, config } = this;
    let pAlias = ctx.params.pageAlias || '';
    let alias = pAlias.replace(".html", "");

    let publicDdata = {};
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

    this.publicData = {
      recentlyArticles: recentlyArticlesRes,
      randomArticlesRes: randomArticlesRes,
      recentlyCommentsRes: recentlyCommentsRes,
      hotArticlesRes: hotArticlesRes,
      commentArticlesRes: commentArticlesRes
    }

    if (!alias) {
      return this.notFound({ ctx, service, config });
    }

    const res = {
      type: "page",
      alias: alias
    }

    await handlers[res.type].call(this, {
      ctx, service, config,
      typeObj: res
    });
  }

  //搜索
  async search() {
    const { ctx, service, config } = this;
    let pKeyword = ctx.params.keyword || ctx.query.s || '';
    let temp = pKeyword.replace(".html", "");
    let keyword = "";
    let pageNum = "";
    if (temp.indexOf("-") !== -1) {
      let tempArr = temp.split("-");
      keyword = tempArr[0] || "";
      pageNum = tempArr[1];
    } else {
      keyword = temp;
      pageNum = ctx.query.pageNum;
    }

    const res = {
      type: "search",
      keyword: keyword,
      pageNum: pageNum
    }

    let publicDdata = {};
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

    this.publicData = {
      recentlyArticles: recentlyArticlesRes,
      randomArticlesRes: randomArticlesRes,
      recentlyCommentsRes: recentlyCommentsRes,
      hotArticlesRes: hotArticlesRes,
      commentArticlesRes: commentArticlesRes
    }

    if (!isNaN(Number(pageNum))) {
      if (pageNum <= 0) {
        return this.notFound({ ctx, service, config });
      }
    }
    if (!keyword) {
      return this.notFound({ ctx, service, config });
    }

    await handlers[res.type].call(this, {
      ctx, service, config,
      typeObj: res
    });
  }
}

MainController.prototype.notFound = handlers.NotFound;

MainController.prototype.render = async function (path, data) {
  const { ctx, service, config, typeObj } = this;
  await ctx.render(`/${config.theme.THEME_NAME}/view/${path}`, data);
}

module.exports = MainController;
