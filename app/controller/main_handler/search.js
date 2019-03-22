const search = async function (opt) {
    const { ctx, service, config, typeObj } = opt;
    const { subtitle, separator } = ctx.locals.webConfig.websiteConfig;
    if (!isNaN(Number(typeObj.pageNum))) {
        if (typeObj.pageNum <= 0) {
            return this.notFound(opt);
        }
    }
    let pageSize = 10;
    let pageNumber = typeObj.pageNum - 1;
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;
    let regKeyword = new RegExp(typeObj.keyword, 'i'); //不区分大小写
    let whereOr= [];
    let where = {}
    if ( typeObj.keyword ) {
        whereOr.push({
            title: {$regex : regKeyword}
        });
        whereOr.push({
            htContent: {$regex : regKeyword}
        });
    }
    if ( whereOr.length ) {
        where = {
            "$or": whereOr
        }
    }
    let articlesRes = await service.article.search(where, pageNumber, pageSize);
    let totalRes = await service.article.count(where);

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

    ctx.locals.webConfig.websiteConfig.title = `“${typeObj.keyword}”的搜索结果${separator}${subtitle}`;

    let data = {
        publicData: this.publicData,
        typeObj: typeObj,
        articles: articlesRes,
        pagination: {
            prefix: `s?s=${typeObj.keyword}`,
            start: 1,
            pages: pages,
            current: pageNumber + 1,
            end: Math.ceil(totalRes / pageSize)
        }
    };

    //最后将搜索者信息和搜索信息插入搜索结果表
    const insertRes = await service.log.create({
        type: 2,
        info: {
            fullUrl: ctx.origin + ctx.url,
            params: ctx.query,
            searcherIp: ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || '未获取到ip地址',
            searcherReferer: ctx.headers['referer'],
            searcherUserAgent: ctx.headers['user-agent']
        }
    });

    await this.render('/pages/search', data);
}

module.exports = search;