'use strict';

const Service = require('egg').Service;

class LogService extends Service {

    /*
     * 新建日志
     */
    async create(LogObj) {
        const Log = new this.ctx.model.Log();
        for (const key in LogObj) {
            Log[key] = LogObj[key];
        }
        return Log.save();
    }

    /*
     * 根据关键字，获取一组日志
     * Callback:
     * - err, 数据库异常ß
     * - Logs, 日志列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[Logs]} 承载日志列表的 Promise 对象
     */
    async getLogsByQuery(query, opt) {
        return this.ctx.model.Log.find(query, '', opt).exec();
    }

    /**
     * 查询日志
     */
    async find(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Log.find(query)
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 搜索日志
     */
    async search(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Log.find(query)
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /***
     *  查找最最新的制定数量的日志
     */
    async findByNum(pageSize) {
        let pageNum = 0;
        return this.ctx.model.Log.find({})
        .populate('questionId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 查找一个日志
     */
    async findOne(query) {
        return this.ctx.model.Log.findOne(query).exec();
    }

    /*
     * 根据日志Id查找日志
     * @param {Object} obj
     */
    async getLogById(LogId) {
        return this.ctx.model.Log.findById(LogId)
        .populate('questionId')
        .exec();
    }


    /**
     * 更新日志信息
     */
    async update(LogId, updateInfo) {
        if (!LogId) {
            return;
        }
        const query = { _id: LogId };
        const update = updateInfo;
        return this.ctx.model.Log.update(query, update).exec();
    }

    /**
     * 通过日志Id删除日志
     */
    async remove(LogId) {
        return this.ctx.model.Log.findOneAndRemove({
            _id: LogId
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Log.count(query).exec();
    }
}

module.exports = LogService;
