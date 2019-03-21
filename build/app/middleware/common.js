'use strict';

module.exports = () => {
    
    const isMenuActive = function(activeUrl, origin, path) {
        if ( !activeUrl ) return false;
        let activeUrls = activeUrl.split(",");
        let fullUrl = origin + path;
        let isActive = false;
        activeUrls.forEach((url) => {
            if ( url[0] === "@" ) {
                let _path = url.split("@")[1];
                if ( _path === path ) {
                    isActive = true;
                }
            } else {
                if ( fullUrl === url ) {
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
        if ( prefix === "/api" ) {
            await next();
            return
        }

        const service = ctx.service;
        const locals = ctx.locals;
        let categories = await service.category.find({});
        let domainBaseConfig = await service.config.findByConfigName("domainBase");
        let websiteConfig = await service.config.findByConfigName("website");
        let menuConfig = await service.config.findByConfigName("menu");
        let tagsConfig = await service.config.findByConfigName("tags");
        let menus = menuConfig.info || [];

        menus.forEach(m => {
            m.isActive = isMenuActive(m.activeUrl, ctx.origin, ctx.request.path);
        });
        
        locals.webConfig = {
            categories: categories,
            domainBase: domainBaseConfig ? domainBaseConfig.info : {} ,
            websiteConfig: websiteConfig ? websiteConfig.info : {},
            menuConfig: menus,
            tagsConfig: tagsConfig ? tagsConfig.info : {},
            origin: ctx.origin,
            path: ctx.request.path,
            currentQuery: ctx.query
        }

        if ( ctx.request.path !== "/s" ) {
            let info = {
                method: ctx.request.method,
                params: {},
                fullUrl: ctx.origin + ctx.url,
                visitorIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
                visitorReferer: ctx.headers['referer'],
                visitorUserAgent: ctx.headers['user-agent'],
                headers: ctx.headers
            }
            if ( ctx.request.method === "GET" ) {
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
