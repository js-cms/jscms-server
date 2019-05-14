/**
 * web端：配置相关服务
 */

'use strict';

const Service = require('egg').Service;

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);

class ConfigService extends Service {

  /** 
   * 更新配置
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Config);
    return db.update(query, target);
  }

  /**
   * 根据别名获取配置数据
   */
  async alias(alias) {
    return this.ctx.model.Config.findOne({
      alias
    }).exec();
  }

  /**
   * 获取搜索关键词（按搜索次数排序）
   */
  async keywords() {
    let keywordsConfig = await this.ctx.model.Config.findOne({
      alias: 'searchKeywordsCount'
    }).exec();
    let object = keywordsConfig.info.keywords;
    let keywords = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const time = object[key];
        keywords.push({
          keyword: key,
          time
        });
      }
    }
    return keywords.sort((i, i2) => i2.time - i.time);
  }

  /**
   * 获取全部的标签数据
   */
  async tags() {
    return this.ctx.model.Config.find({
      alias: 'tags'
    }).exec();
  }

}

module.exports = ConfigService;