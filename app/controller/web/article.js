'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {

  /**
   * 文章页
   */
  async index() {
    // 初始化
    await this.init();
    // 加载处理器
    await this.handler();
  }

  async handler() {
    const { ctx, service, config } = this;
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
    let numberId = ctx.params[0];

    //获取文章
    let findArticleRes = await service.article.findOneForWeb({ numberId });
    if (!findArticleRes) {
      return this.notFound();
    }

    //获取文章评论
    let findCommentRes = await service.comment.find({ articleId: findArticleRes._id });

    //重写页面元信息
    this.setMeta({
      title: `${findArticleRes.title}${separator}${subtitle}`,
      keywords: findArticleRes.keywords.join(','),
      description: findArticleRes.description,
    });

    //更新文章浏览量
    let updateArticle = await service.article.update({
      _id: findArticleRes._id
    }, {
        $inc: { 'visNumber': Number(1) }
      });

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
          '$or': whereOr
        }
      }
      let articlesRes = await service.article.search(where);
      return articlesRes;
    }

    //获取相关推荐文章
    let relatedArticles = [];
    if (findArticleRes.keywords.length === 1) {
      let articles = await searchArticle(findArticleRes.keywords[0]);
      relatedArticles = articles;
    } else if (findArticleRes.keywords.length === 2) {
      let articles = await searchArticle(findArticleRes.keywords[0]);
      relatedArticles = articles;
      articles = await searchArticle(findArticleRes.keywords[1]);
      relatedArticles = relatedArticles.concat(articles);
    } else if (findArticleRes.keywords.length === 3) {
      let articles = await searchArticle(findArticleRes.keywords[0]);
      relatedArticles = articles;
      articles = await searchArticle(findArticleRes.keywords[1]);
      relatedArticles = relatedArticles.concat(articles);
      articles = await searchArticle(findArticleRes.keywords[2]);
      relatedArticles = relatedArticles.concat(articles);
    }
    if (relatedArticles.length > 6) {
      relatedArticles = relatedArticles.slice(0, 6);
    } else if (relatedArticles.length === 0) {
      relatedArticles = relatedArticles.concat(this.cache('RENDER_DATA').randomArticles3);
      if (relatedArticles.length > 6) {
        relatedArticles = relatedArticles.slice(0, 6);
      }
    }
    
    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'article' || 'unknown',
      // 文章数字id: Number
      numberId: numberId || 0,
      // 文章对象: Object
      article: findArticleRes || [],
      // 该文章的评论: Array
      comments: findCommentRes || [],
      // 相关文章: Array
      relate: relatedArticles || []
    });

    await this.render('/pages/article', {});
  }

}

module.exports = ArticleController;
