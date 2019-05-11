/**
 * 前台文章相关的api接口
 */

'use strict';

const BaseController = require('../base');

class ArticleController extends BaseController {

  /**
   * 点赞某个文章
   */
  async like() {
    const {
      service
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '文章id',
          type: 'ObjectId',
          f: true,
          r: true
        }
      }
    });

    const article = await service.api.front.article.articleId(this.params.id);

    if (!article) this.throwError('文章未找到');

    // 给文章增加点赞数
    await service.api.front.article.updateLike(this.params.id);

    this.throwCorrect({
      count: article.likeTotal + 1
    }, '点赞成功');
  }
}

module.exports = ArticleController;