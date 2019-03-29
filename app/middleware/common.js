'use strict';

const path = require('path');

async function getWebConfig(service, name) {
  let res = await service.config.findByConfigName(name);
  return res && res.info ? res.info : false;
}

module.exports = () => {

  //判断是否激活菜单高亮
  const isMenuActive = function (activeUrl, origin, path) {
    if (!activeUrl) return false;
    let activeUrls = activeUrl.split(",");
    let fullUrl = origin + path;
    let isActive = false;
    activeUrls.forEach((url) => {
      if (url[0] === "@") {
        let _path = url.split("@")[1];
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

  //获取模版需要的公共数据
  return async function (ctx, next) {
    const prefix = ctx.request.path.substring(0, 4);
    //忽略api后缀请求
    if (prefix === "/api") {
      await next();
      return;
    }
    const { service, locals } = ctx;
    const config = ctx.app.config;

    let categories = await service.category.find({});
    let domains = await getWebConfig(service, config.constant.webConfigNames.DOMAIN_NAME);
    let site = await getWebConfig(service, config.constant.webConfigNames.SITE_NAME);
    let menus = await getWebConfig(service, config.constant.webConfigNames.MENU_NAME);
    let tags = await getWebConfig(service, config.constant.webConfigNames.TAG_NAME);

    menus ? menus.forEach(m => {
      m.isActive = isMenuActive(m.activeUrl, ctx.origin, ctx.request.path);
    }) : void(0);

    locals.CONFIG = {
      THEME_STATIC: path.join(config.constant.directory.JSCMS_URL_THEME_STATIC, config.theme.THEME_NAME)
    }

    locals.webConfig = {
      categories: categories,
      domains: domains ? domains : {},
      site: site ? site : {},
      menus: menus ? menus : [],
      tags: tags ? tags : [],
      origin: ctx.origin,
      path: ctx.request.path,
      currentQuery: ctx.query
    }

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
      const insertRes = await service.log.create({
        type: 1,
        info: info
      });
    }

    await next();
  };
};
