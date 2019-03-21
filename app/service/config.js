'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

    /*
     * 新建配置
     */
    async create(configObj) {
        const config = new this.ctx.model.Config();
        for (const key in configObj) {
            config[key] = configObj[key];
        }
        return config.save();
    }

    /*
     * 根据关键字，获取一组配置
     * Callback:
     * - err, 数据库异常ß
     * - configs, 配置列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[configs]} 承载配置列表的 Promise 对象
     */
    async getConfigsByQuery(query, opt) {
        return this.ctx.model.Config.find(query, '', opt).exec();
    }

    /**
     * 查询配置
     */
    async find(query) {
        return this.ctx.model.Config.find(query)
        .exec();
    }

    /**
     * 查找一个配置
     */
    async findOne(query) {
        return this.ctx.model.Config.findOne(query)
        .exec();
    }

    /*
     * 根据配置Id查找配置
     * @param {Object} obj
     */
    async getConfigById(configId) {
        return this.ctx.model.Config.findById(configId)
        .exec();
    }


    /**
     * 更新配置信息
     */
    async update(configId, updateInfo) {
        if (!configId) {
            return;
        }
        const query = { _id: configId };
        const update = updateInfo;
        return this.ctx.model.Config.update(query, update).exec();
    }

    /**
     * 通过配置Id删除配置
     */
    async remove(configId) {
        return this.ctx.model.Config.findOneAndRemove({
            _id: configId
        }).exec();
    }

    /**
     * 查询配置，根据配置名称
     */
    async findByConfigName(aliasName) {
        return this.ctx.model.Config.findOne({
            alias: aliasName
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Config.count(query).exec();
    }
}

module.exports = ConfigService;
