/**
 * web渲染基类控制器
 */

'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class BaseController extends Controller {

  /**
   * 初始化公共数据
   */
  async init() {
    // 记录访问信息
    await this.log();
    // 加载web配置
    await this.loadWebConfig();
    // 加载渲染数据
    await this.loadRenderData();
  }

  /**
   * 缓存数据
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

  /**
   * 记录访问信息
   */
  async log() {
    const {
      ctx,
      service
    } = this;
    if (ctx.request.path !== '/s') {
      let info = {
        method: ctx.request.method,
        params: {},
        fullUrl: ctx.origin + ctx.url,
        visitorIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
        visitorReferer: ctx.headers['referer'],
        visitorUserAgent: ctx.headers['user-agent'],
        headers: ctx.headers
      }
      if (ctx.request.method === 'GET') {
        info.params = ctx.query || {};
      } else {
        info.params = ctx.request.body || {};
      }
      //将访问者信息插入log表
      await service.web.log.create({
        type: 1,
        info: info
      });
    }
  }

  /**
   * 加载渲染数据
   */
  async loadRenderData() {
    const {
      service
    } = this;
    // 缓存渲染模版数据
    this.cache('RENDER_DATA', {
      // 最近三篇文章
      recentArticles3: await service.web.article.list({}, 0, 3),
      // 随机三篇文章
      randomArticles3: await service.web.article.random(3),
      // 最近三条评论
      recentComments3: await service.web.comment.list({}, 0, 3),
      // 获取浏览量最多的5篇文章
      hotArticles: await service.web.article.visHot(), 
      // 获取评论量最多的5篇文章
      commentTopArticles: await service.web.article.commentHot(),
      // 获取热搜词
      hotSearchKeywords: await service.web.config.keywords()
    });
  }

  /**
   * 加载web配置
   */
  async loadWebConfig() {
    const {
      ctx,
      service,
      config
    } = this;

    /**
     * 查询配置项
     */
    async function getWebConfig(name) {
      let res = await service.web.config.alias(name);
      return res && res.info ? res.info : false;
    }

    /**
     * 排序函数
     * @param {Object} object 
     */
    function eachSort(object) {
      object = object.sort((item1, item2) => {
        if (item1.hasChild) eachSort(item1.children);
        return item1.order - item2.order;
      });
    }

    /**
     * 判断是否激活菜单高亮
     */
    function isMenuActive(activeUrl, origin, path) {
      if (!activeUrl) return false;
      let activeUrls = activeUrl.split(',');
      let fullUrl = origin + path;
      let isActive = false;
      activeUrls.forEach((url) => {
        if (url[0] === '@') {
          let _path = url.split('@')[1];
          if (_path === path) {
            isActive = true;
          }
        } else {
          if (fullUrl === url) {
            isActive = true;
          }
        }
      });
      return isActive;
    }

    /**
     * 菜单处理器
     * @param {Array} menus 
     */
    async function menusHandle(menus) {
      if (!menus || menus.length === 0) return;
      let newMenus = [];

      function checkValid(item) {
        if (!item.type) return false;
        if (item.type) {
          if (item.type === 'link') {
            if (!item.link) return false;
          } else if (item.type === 'category') {
            if (!item.categoryId) return false;
          }
        }
        if (!item.name) return false;
        if (!item.alias) return false;
        return true;
      }

      async function eachHandle(menus) {
        for (const item of menus) {
          if (!checkValid(item)) {
            item.isValid = false;
            break;
          }
          if (item.type == 'category') {
            let category = await service.api.back.category.id(item.categoryId);
            if (!category) {
              item.isValid = false;
              break;
            }
            item.link = `/${category.alias}.html`;
            item.activeUrl = '@' + item.link;
          }
          item.isActive = isMenuActive(item.activeUrl, ctx.origin, ctx.request.path);
          item.hasChild = item.children && item.children.length > 0;
          item.isValid = true;
          if (item.hasChild === true) await eachHandle(item.children);
        }
      }

      await eachHandle(menus);
      eachSort(menus);
    }

    /**
     * 链接处理
     */
    function linksHandle(links) {
      eachSort(links);
    }

    // 获取各项配置
    let categories = await service.web.category.all();
    let domains = await getWebConfig(config.constant.webConfigNames.DOMAIN_NAME);
    let site = await getWebConfig(config.constant.webConfigNames.SITE_NAME);
    let notices = await getWebConfig(config.constant.webConfigNames.NOT_NAME);
    let menus = await getWebConfig(config.constant.webConfigNames.MENU_NAME);
    let tags = await getWebConfig(config.constant.webConfigNames.TAG_NAME);
    let links = await getWebConfig(config.constant.webConfigNames.LINK_NAME);
    let searchKeywordsCount = await getWebConfig(config.constant.webConfigNames.SKC_NAME);

    // 菜单处理
    await menusHandle(menus);

    // 链接处理
    linksHandle(links);

    // 记入缓存
    this.cache('WEB_CONFIG', {
      categories: categories || [],
      domains: domains || {},
      site: site || {},
      notices: notices || {},
      menus: menus || [],
      tags: tags || [],
      links: links || [],
      searchKeywordsCount: searchKeywordsCount || {},
      origin: ctx.origin,
      path: ctx.request.path,
      query: ctx.query
    });
  }

  /**
   * 修改页面元信息
   * @param {Object} opts object
   */
  async setMeta(opts = {
    title: '',
    keywords: '',
    description: ''
  }) {
    let webConfig = this.cache('WEB_CONFIG');
    if (opts.title) {
      webConfig.site.title = opts.title;
    };
    if (opts.keywords) {
      webConfig.site.keywords = opts.keywords;
    };
    if (opts.description) {
      webConfig.site.description = opts.description;
    };
    this.cache('WEB_CONFIG', webConfig);
  }

  /**
   * 封装渲染方法
   * @param {String} viewPath 模版路径
   * @param {Object} data 自定义数据
   */
  async render(viewPath, data) {
    const {
      ctx,
      config
    } = this;
    let commonData = {
      // 渲染参数
      RENDER_PARAM: this.cache('RENDER_PARAM') || {},
      // 渲染数据
      RENDER_DATA: this.cache('RENDER_DATA') || {},
      // 网站公共配置
      WEB_CONFIG: this.cache('WEB_CONFIG') || {},
      // 程序常量
      CONSTANT: {
        // 模版静态文件目录网址
        THEME_STATIC: path.join(config.constant.directory.JSCMS_URL_THEME_STATIC, config.theme.THEME_NAME, 'static')
      }
    }
    await ctx.render(`/${config.theme.THEME_NAME}/view/${viewPath}`, Object.assign(commonData, data));
  }

  /**
   * 分页算法
   * @param {Number} total 数据总数
   * @param {Number} pageNumber 当前页码
   * @param {Number} pageSize 每页显示数量
   * @param {Number} pos 偏移量
   */
  paging(
    total = 0,
    pageNumber = 0,
    pageSize = 10,
    pos = 2
  ) {
    let pages = [];
    let totalNum = Math.ceil(total / pageSize);
    Array.from({
      length: pageSize
    }).forEach((i, index) => {
      let beforeNum = (pageNumber - (pos - index)) + 1;
      let currentNum = pageNumber + 1;
      let afterNum = (pageNumber + (index - pos)) + 1;
      if (beforeNum > 0 && index < pos) {
        pages.push({
          num: beforeNum,
          isCurrent: false
        });
      } else if (index === pos) {
        pages.push({
          num: currentNum,
          isCurrent: true
        });
      } else if (afterNum <= totalNum && index > pos) {
        pages.push({
          num: afterNum,
          isCurrent: false
        });
      }
    });
    return pages;
  }

  /**
   * 自定义页面路由
   */
  async customRoute() {
    const {
      ctx,
      service
    } = this;
    let route = ctx.params.route || ctx.path;
    route = route[0] === '/' ? route : '/' + route;
    let page = await service.web.page.route(route);
    if (!page) {
      return this.notFound();
    }
    let contentType = page.contentType || 'text/html; charset=utf-8';
    let content = page.html;
    ctx.response.set('content-type', contentType);
    ctx.body = content;
  }

  /**
   * 404未找到
   */
  async notFound() {
    const {
      service
    } = this;
    await this.init();

    const tags = await service.web.config.tags();

    // 重新覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const {
      title,
      separator,
      subtitle
    } = webConfig.site;
    this.setMeta({
      title: `页面未找到${separator}${subtitle}`,
      keywords: `${title}404,${title}页面未找到`,
      description: `${title}页面未找到`
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: '404' || 'unknown',
      // 标签数组: Array
      tags: tags || 0
    });

    await this.render('/pages/404', {});
  }

}

module.exports = BaseController;