/**
 * 前台文章相关的api接口
 */

'use strict';

const BaseController = require('../base');

class ArticleController extends BaseController {

  /**
   * @description 点赞某个文章
   */
  async like() {
    const { service } = this;
    this.decorator({
      post: {
        id: { type: 'ObjectId', f: true, r: true }
      }
    });

    const article = await service.article.findOne({ _id: this.params.id });

    // 给文章增加点赞数
    await service.article.updateOne({ _id: this.params.id }, {
      $inc: { likeTotal: Number(1) }
    });

    this.throwCorrect({
      count: article.likeTotal + 1
    }, '点赞成功');
  }
}

module.exports = ArticleController;
