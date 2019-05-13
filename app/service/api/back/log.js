/**
 * 后台API：日志相关数据服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const logModel = require(`${appPath}/model/proto/log`);

class LogService extends Service {
  
  /**
   * 创建日志
   */
  async create(data) {
    const db = new Db(this.ctx.model.Log);
    let newData = db.parseModelman(data, logModel);
    return db.create(newData);
  }

  /**
   * 查找符合条件的多个日志
   */
  async all(query) {
    return this.ctx.model.Log.find(query).exec();
  }

  /**
   * 删除日志
   */
  async remove(query) {
    const db = new Db(this.ctx.model.Log);
    return db.remove(query);
  }

  /**
   * 查询日志（带分页功能）
   */
  async find(query, pageNumber = 0, pageSize = 10) {
    return this.ctx.model.Log.find(query)
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
    return this.ctx.model.Log.count(query).exec();
  }
}

module.exports = LogService;