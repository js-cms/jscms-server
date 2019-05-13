/**
 * 后台API：资源相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const resourceModel = require(`${appPath}/model/proto/resource`);

class ResourceService extends Service {

  /**
   * 创建资源
   */
  async create(data) {
    const db = new Db(this.ctx.model.Resource);
    let newData = db.parseModelman(data, resourceModel);
    return db.create(newData);
  }

  /**
   * 删除资源
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Resource);
    return db.remove(query);
  }

  /**
   * 根据条件查询资源（带分页功能）
   */
  async find(query, pageNumber = 0, pageSize = 8) {
    return this.ctx.model.Resource.find(query)
      .sort({
        'createTime': -1
      })
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();
  }

  /**
   * 统计
   */
  async count(query) {
    return this.ctx.model.Resource.count(query).exec();
  }
}

module.exports = ResourceService;