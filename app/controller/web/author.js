'use strict';

const BaseController = require('./base');

class AuthorController extends BaseController {

  /**
   * 作者页
   */
  async index() {
    // 初始化
    await this.init();
    // 加载处理器
    await this.handler();
  }
  
  /**
   * 处理器
   */
  async handler() {
    const { ctx, service } = this;
    let { nickname, pageNumber } = this.toStructure(ctx.params.nickname);
    let pageSize = 10;

    if ( pageNumber < 0 ) {
      return this.notFound();
    }

    let findUserRes = await service.user.findOne({nickname: nickname});
    if (!findUserRes) {
      return this.notFound();
    }

    let articles = await service.article.find({ userId: findUserRes._id }, pageNumber, pageSize);
    let total = await service.article.count({ userId: findUserRes._id });

    // 分页算法
    let pages = this.paging(
      total,
      pageNumber,
      pageSize
    );

    // 覆盖元信息
    let webConfig = this.cache('WEB_CONFIG');
    const { subtitle, separator } = webConfig.site;
    this.setMeta({
      title: `${findUserRes.nickname}发表的文章${separator}${subtitle}`,
      keywords: `${findUserRes.nickname}发表的文章${separator}${subtitle}`,
      description: findUserRes.about,
    });

    this.cache('RENDER_PARAM', {
      // 页面类型: String
      pageType: 'author' || 'unknown',
      // 作者页对象: Object
      author: findUserRes || {},
      // 所属该作者的文章列表：Array
      articles: articles || [],
      // 分页信息：Object
      pagination: {
        prefix: `author/${nickname}`,
        start: 1,
        pages: pages,
        current: pageNumber + 1,
        end: Math.ceil(total / pageSize)
      }
    });

    // 输出作者文章页
    await this.render('/pages/author', {});
  }

  /**
   * 解析参数结构
   * @param {Object} params 
   */
  toStructure(params) {
    let tempArr = params.split('-');
    let nickname = tempArr[0].replace('.html', '');
    let pageNumber = tempArr[1] || '0.html';
    pageNumber = Number(pageNumber.replace('.html', '')) - 1;
    pageNumber = isNaN(pageNumber) || pageNumber < 0 ? 0 : pageNumber;
    return {
      nickname: nickname,
      pageNumber: pageNumber
    }
  }

}

module.exports = AuthorController;
