const category = async function (opt) {
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

    let findCategoryRes = await service.category.findOne({ alias: typeObj.catName });
    if (!findCategoryRes) {
        return this.notFound(opt);
    }

    let articlesRes = await service.article.find({ categoryId: findCategoryRes._id }, pageNumber, pageSize);
    let totalRes = await service.article.count({ categoryId: findCategoryRes._id });

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

    ctx.locals.webConfig.websiteConfig.title = `${findCategoryRes.title}${(findCategoryRes.title ? ',' : '') + findCategoryRes.name}${separator}${subtitle}`;
    ctx.locals.webConfig.websiteConfig.keywords = findCategoryRes.keywords;
    ctx.locals.webConfig.websiteConfig.description = findCategoryRes.description;

    let data = {
        publicData: this.publicData,
        category: findCategoryRes,
        typeObj: typeObj,
        articles: articlesRes,
        pagination: {
            prefix: typeObj.catName,
            start: 1,
            pages: pages,
            current: pageNumber + 1,
            end: Math.ceil(totalRes / pageSize)
        }
    };

    await this.render('/pages/category', data);
}

module.exports = category;