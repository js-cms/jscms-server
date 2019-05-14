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
        numberId: {
          n: '文章NumberId',
          type: 'Number',
          f: true,
          r: true
        }
      }
    });

    const article = await service.api.front.article.numberId(this.params.numberId);

    if (!article) this.throwError('文章未找到');

    // 给文章增加点赞数
    await service.api.front.article.updateLike(article._id);

    this.throwCorrect({
      count: article.likeTotal + 1
    }, '点赞成功');
  }
}

module.exports = ArticleController;