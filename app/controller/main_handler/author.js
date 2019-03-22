const author = async function (opt) {
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

    let findUserRes = await service.user.findOne({ nickname: typeObj.nickname });
    if (!findUserRes) {
        return this.notFound(opt);
    }

    let articlesRes = await service.article.find({ userId: findUserRes._id }, pageNumber, pageSize);
    let totalRes = await service.article.count({ userId: findUserRes._id });

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

    ctx.locals.webConfig.websiteConfig.title = `${findUserRes.nickname}发表的文章${separator}${subtitle}`;

    let data = {
        publicData: this.publicData,
        author: findUserRes,
        typeObj: typeObj,
        articles: articlesRes,
        pagination: {
            prefix: `author/${typeObj.nickname}`,
            start: 1,
            pages: pages,
            current: pageNumber + 1,
            end: Math.ceil(totalRes / pageSize)
        }
    };

    await this.render('/pages/author', data);
}

module.exports = author;