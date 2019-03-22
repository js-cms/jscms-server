const page = async function (opt) {
    const { ctx, service, config, typeObj } = opt;
    const { subtitle, separator } = ctx.locals.webConfig.websiteConfig;

    //获取页面信息
    let findPageRes = await service.page.findOne({ alias: typeObj.alias });
    console.log(findPageRes);
    if (!findPageRes) {
        return this.notFound(opt);
    }

    ctx.locals.webConfig.websiteConfig.title = `${findPageRes.title}${separator}${subtitle}`;
    ctx.locals.webConfig.websiteConfig.keywords = findPageRes.keywords;
    ctx.locals.webConfig.websiteConfig.description = findPageRes.description;

    let data = {
        publicData: this.publicData,
        typeObj: typeObj,
        page: findPageRes
    };

    await this.render('/pages/page', data);
}

module.exports = page;