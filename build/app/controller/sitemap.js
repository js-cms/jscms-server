'use strict';

const Controller = require('egg').Controller;
const url = require('url');

class SitemapController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        const _articles = await service.article.findAll();
        let articles = "";
        _articles.forEach((item, index) => {
            let url = ctx.origin + "/" + item.serialNumber + ".html";
            articles = articles + url + (index < _articles.length - 1 ? "\n" : "");
        });
        ctx.body = articles;
    }
}

module.exports = SitemapController;