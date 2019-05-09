'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const logModel = require(`${appPath}/model/proto/log`);

class LogService extends Service {

  /**
   * 查找符合条件的多个日志
   */
  async all(query) {
    return this.ctx.model.Log.find(query).exec();
  }
}

module.exports = LogService;
