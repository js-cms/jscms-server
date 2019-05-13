/**
 * web端：分类相关服务
 */

'use strict';

const Service = require('egg').Service;

class CategoryService extends Service { 

  /**
   * 查询符合条件的分类
   */
  async find(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Category.find(query)
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 获取全部分类并按照权重重新进行排序（web端专用）
   */
  async all() {
    let list = await this.find({});
    list = list.sort((item1, item2) => {
      return item1.order - item2.order;
    });
    return list;
  }

  /**
   * 通过英文别名查询一个分类
   */
  async alias(alias) {
    return this.ctx.model.Category.findOne({alias}).exec();
  }
}

module.exports = CategoryService;