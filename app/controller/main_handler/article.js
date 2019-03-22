const article = async function (opt) {
  const { ctx, service, config, typeObj } = opt;
  const { subtitle, separator } = ctx.locals.webConfig.websiteConfig;

  //获取文章
  let findArticleRes = await service.article.findOneForWWW({ serialNumber: typeObj.value });
  if (!findArticleRes) {
    return this.notFound(opt);
  }

  //获取评论
  let findCommentRes = await service.comment.find({ articleId: findArticleRes._id });

  ctx.locals.webConfig.websiteConfig.title = `${findArticleRes.title}${separator}${subtitle}`;
  ctx.locals.webConfig.websiteConfig.keywords = findArticleRes.keywords.join(",");
  ctx.locals.webConfig.websiteConfig.description = findArticleRes.description;

  //更新文章浏览量
  let updateArticle = await service.article.update(findArticleRes._id,
    {
      $inc: { 'visNumber': Number(1) }
    }
  )

  //定义内部搜索函数
  const searchArticle = async function (keyword) {
    let regKeyword = new RegExp(keyword, 'i'); //不区分大小写
    let whereOr = [];
    let where = {}
    if (typeObj.keyword) {
      whereOr.push({
        title: { $regex: regKeyword }
      });
      whereOr.push({
        htContent: { $regex: regKeyword }
      });
    }
    if (whereOr.length) {
      where = {
        "$or": whereOr
      }
    }
    let articlesRes = await service.article.search(where);
    return articlesRes;
  }

  //获取相关推荐文章
  let associateRecommendation = [];
  if (findArticleRes.keywords.length === 1) {
    let articles = await searchArticle(findArticleRes.keywords[0]);
    associateRecommendation = articles;
  } else if (findArticleRes.keywords.length === 2) {
    let articles = await searchArticle(findArticleRes.keywords[0]);
    associateRecommendation = articles;
    articles = await searchArticle(findArticleRes.keywords[1]);
    associateRecommendation = associateRecommendation.concat(articles);
  } else if (findArticleRes.keywords.length === 3) {
    let articles = await searchArticle(findArticleRes.keywords[0]);
    associateRecommendation = articles;
    articles = await searchArticle(findArticleRes.keywords[1]);
    associateRecommendation = associateRecommendation.concat(articles);
    articles = await searchArticle(findArticleRes.keywords[2]);
    associateRecommendation = associateRecommendation.concat(articles);
  }
  if (associateRecommendation.length > 6) {
    associateRecommendation = associateRecommendation.slice(0, 6);
  } else if (associateRecommendation.length < 6) {
    associateRecommendation = associateRecommendation.concat(this.publicData.randomArticlesRes);
    if (associateRecommendation.length > 6) {
      associateRecommendation = associateRecommendation.slice(0, 6);
    }
  }

  let data = {
    publicData: this.publicData,
    article: findArticleRes,
    comments: findCommentRes || [],
    associateRecommendation: associateRecommendation,
    typeObj: typeObj
  };

  await this.render('/pages/article', data);
}

module.exports = article;
