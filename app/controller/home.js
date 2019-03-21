'use strict';

const Controller = require('egg').Controller;

const utils = require('../main/utils');
const actionHome = require('../main/home');
const actionCategory = require('../main/category');
const actionAuthor = require('../main/author');
const actionTags = require('../main/tags');
const actionSearch = require('../main/search');
const actionArticle = require('../main/article');
const actionPage = require('../main/page');
const actionNotFound = require('../main/notfound');

//执行器
let Action = {
    //首页
    home: actionHome,

    //分类页
    category: actionCategory,

    //用户文章页
    author: actionAuthor,

    //标签文章页
    tags: actionTags,

    //搜索页
    search: actionSearch,

    //文章页
    article: actionArticle,

    //自定义页面
    page: actionPage,

    //404页
    notFound: actionNotFound
}

class HomeController extends Controller  {

    //首页
    async index() {
        const { ctx, service, config } = this;
        const routerName = ctx.params.routerName || '';
        const res = utils.getType(routerName);
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

        await Action[res.type].call(this, {
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
        
        await Action[res.type].call(this, {
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

        await Action[res.type].call(this, {
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

        if ( !alias ) {
            return this.notFound({ ctx, service, config });
        }

        const res = {
            type: "page",
            alias: alias
        }

        await Action[res.type].call(this, {
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
        if ( temp.indexOf("-") !== -1 ) {
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

        await Action[res.type].call(this, {
            ctx, service, config,
            typeObj: res
        }); 
    }
}

HomeController.prototype.notFound = actionNotFound;

module.exports = HomeController;