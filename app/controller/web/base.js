'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class BaseController extends Controller {

  /**
   * @description 初始化公共数据
   * @param {Object} data 
   */
  async init(data = {}) {
    const { ctx, service, config } = this;
    // 记录访问信息
    await this.log();
    // 加载web配置
    await this.loadWebConfig();
    // 加载渲染数据
    await this.loadRenderData();
  }

  /**
   * @description 缓存数据
   * @param  {...any} argv 
   */
  cache(...argv) {
    this._cache = this._cache ? this._cache : {};
    if (argv.length === 1) {
      return this._cache[argv[0]];
    } else if (argv.length === 2) {
      this._cache[argv[0]] = argv[1];
    }
  }

  //404页面
  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  /**
   * @description 记录访问信息
   */
  async log() {
    const { ctx, service, config } = this;
    if (ctx.request.path !== "/s") {
      let info = {
        method: ctx.request.method,
        params: {},
        fullUrl: ctx.origin + ctx.url,
        visitorIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
        visitorReferer: ctx.headers['referer'],
        visitorUserAgent: ctx.headers['user-agent'],
        headers: ctx.headers
      }
      if (ctx.request.method === "GET") {
        info.params = ctx.query || {};
      } else {
        info.params = ctx.request.body || {};
      }
      //将访问者信息插入log表
      await service.log.create({
        type: 1,
        info: info
      });
    }
  }

  /**
   * @description 加载渲染数据
   */
  async loadRenderData() {
    const { ctx, service, config } = this;
    // 缓存渲染模版数据
    this.cache('RENDER_DATA', {
      // 最近三篇文章
      recentArticles3: await service.article.find({}, 0, 3),
      // 随机三篇文章
      randomArticles3: await service.article.findRandom(3),
      // 最近三条评论
      recentComments3: await service.comment.findByQuery({}, 0, 3),
      // 获取浏览量最多的5篇文章
      hotArticles5: await service.article.findByHot({}, 0, 5),
      // 获取评论量最多的5篇文章
      commentTopArticles5: await service.article.findByComment({}, 0, 5)
    });
  }

  /**
   * @description 加载web配置
   */
  async loadWebConfig() {
    const { ctx, service, config } = this;

    async function getWebConfig(name) {
      let res = await service.config.findByConfigName(name);
      return res && res.info ? res.info : false;
    }

    let categories = await service.category.find({});
    let domains = await getWebConfig(config.constant.webConfigNames.DOMAIN_NAME);
    let site = await getWebConfig(config.constant.webConfigNames.SITE_NAME);
    let menus = await getWebConfig(config.constant.webConfigNames.MENU_NAME);
    let tags = await getWebConfig(config.constant.webConfigNames.TAG_NAME);

    this.cache('WEB_CONFIG', {
      categories: categories || [],
      domains: domains || {},
      site: site || {},
      menus: menus || [],
      tags: tags || [],
      origin: ctx.origin,
      path: ctx.request.path,
      query: ctx.query
    });
  }

  /**
   * @description 修改页面元信息
   * @param {Opts} Object 参数
   */
  async setMeta(opts = {
    title: '',
    keywords: '',
    description: ''
  }) {
    const { ctx, service, config } = this;
    let webConfig = this.cache('WEB_CONFIG');
    if (opts.title) { webConfig.site.title = opts.title; };
    if (opts.keywords) { webConfig.site.keywords = opts.keywords; };
    if (opts.titdescriptionle) { webConfig.site.description = opts.description; };
    this.cache('WEB_CONFIG', webConfig);
  }

  /**
   * @description 封装渲染方法
   * @param {Stirng} viewPath 模版路径
   * @param {Object} data 自定义数据
   */
  async render(viewPath, data) {
    const { ctx, service, config } = this;
    let commonData = {
      // 渲染参数
      RENDER_PARAM: this.cache('RENDER_PARAM') || {},
      // 渲染数据
      RENDER_DATA: this.cache('RENDER_DATA') || {},
      // 网站公共配置
      WEB_CONFIG: this.cache('WEB_CONFIG') || {},
      // 程序常量
      CONSTANT: {
        //模版静态网址
        THEME_STATIC: path.join(config.constant.directory.JSCMS_URL_THEME_STATIC, config.theme.THEME_NAME)
      }
    }
    await ctx.render(`/${config.theme.THEME_NAME}/view/${viewPath}`, Object.assign(commonData, data));
  }

}

module.exports = BaseController;
