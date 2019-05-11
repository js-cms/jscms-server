'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

const appPath = `${process.cwd()}/app`;
const Db = require(`${appPath}/service/Db.js`);
const configModel = require(`${appPath}/model/proto/config`);

class ConfigService extends Service {

  /**
   * 更新配置
   */
  async update(query, target) {
    const db = new Db(this.ctx.model.Config);
    return db.update(query, target);
  }

  /**
   * 查找一个配置
   */
  async findOne(query) {
    return this.ctx.model.Config.findOne(query)
      .exec();
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
   * numberId自增（活动控制器使用）
   */
  async numberId(params) {
    let findConfig = await this.ctx.model.Config.findOne({
      alias: 'articleCount'
    });
    let numberId = Number(findConfig.info.num) + 1;
    await this.update({
      _id: findConfig._id
    }, {
      info: {
        num: numberId
      }
    });
    params.numberId = numberId;
  }

  /**
   * 更新标签信息（活动控制器使用）
   */
  async updateTagsForArticle(params) {
    if (params.keywords && params.keywords.length) {
      let findTagsRes = await this.ctx.model.Config.findOne({
        alias: 'tags'
      });
      let newTags = _.uniq([...params.keywords, ...findTagsRes.info]);
      return this.update({
        _id: findTagsRes._id
      }, {
        info: newTags
      });
    }
  }
}

module.exports = ConfigService;