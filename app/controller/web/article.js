'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {

  /**
   * 文章页
   */
  async index() {
    await this.loadCommonData();
    await this.handler();
  }

  async handler() {
    const { ctx, service, config } = this;
    const { subtitle, separator } = webConfig.site;
    let webConfig = ctx.locals.webConfig;
    let serialNumber = ctx.params[0];
  
    //获取文章
    let findArticleRes = await service.article.findOneForWeb({ serialNumber });
    if (!findArticleRes) {
      return this.notFound(this);
    }
  
    //获取文章评论
    let findCommentRes = await service.comment.find({ articleId: findArticleRes._id });
    
    //写入全局配置
    webConfig.site.title = `${findArticleRes.title}${separator}${subtitle}`;
    webConfig.site.keywords = findArticleRes.keywords.join(",");
    webConfig.site.description = findArticleRes.description;
  
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
      if (keyword) {
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
      associateRecommendation = associateRecommendation.concat(this.cache('RENDER_DATA').randomArticlesRes);
      if (associateRecommendation.length > 6) {
        associateRecommendation = associateRecommendation.slice(0, 6);
      }
    }
  
    let data = {
      article: findArticleRes,
      comments: findCommentRes || [],
      associateRecommendation: associateRecommendation
    };
  
    await this.render('/pages/article', data);
  }

}

module.exports = ArticleController;
