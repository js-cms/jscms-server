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
  
}

module.exports = LogService;
