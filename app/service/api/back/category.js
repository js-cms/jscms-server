/**
 * 后台API：分类相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const categoryModel = require(`${appPath}/model/proto/category`);

class CategoryService extends Service {

  /**
   * 创建分类
   */
  async create(data) {
    const db = new Db(this.ctx.model.Category);
    let newData = db.parseModelman(data, categoryModel);
    return db.create(newData);
  }

  /**
   * 更新分类
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Category);
    return db.update(query, target);
  }

  /**
   * 删除分类
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Category);
    return db.remove(query);
  }

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
   * 通过id查询一个分类
   */
  async id(_id) {
    return this.ctx.model.Category.findOne({_id}).exec();
  }

  /**
   * 查询一个分类
   */
  async findOne(query) {
    return this.ctx.model.Category.findOne(query).exec();
  }

  /**
   * 统计
   */
  async count() {
    return this.ctx.model.Category.count({}).exec();
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
   * 解析分类名称（活动控制器使用）
   */
  async parseNameForArticle(params) {
    if (params.categoryName) {
      let findCatRes = await this.ctx.model.Category.findOne({
        name: params.categoryName
      });
      params.categoryId = findCatRes._id;
      delete params.categoryName;
    }
  }

  /**
   * 让某个分类增加文章数量（活动控制器使用）
   */
  async addNumForArticle(params) {
    return this.update({
      _id: params.categoryId
    }, {
      $inc: {
        articleTotal: 1
      }
    });
  }

}

module.exports = CategoryService;