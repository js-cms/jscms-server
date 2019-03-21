'use strict';

const Service = require('egg').Service;

class ResourceService extends Service {

    /*
     * 新建资源
     */
    async create(ResourceObj) {
        const Resource = new this.ctx.model.Resource();
        for (const key in ResourceObj) {
            Resource[key] = ResourceObj[key];
        }
        return Resource.save();
    }

    /*
     * 根据关键字，获取一组资源
     * Callback:
     * - err, 数据库异常ß
     * - Resources, 资源列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[Resources]} 承载资源列表的 Promise 对象
     */
    async getResourcesByQuery(query, opt) {
        return this.ctx.model.Resource.find(query, '', opt).exec();
    }

    /**
     * 查询资源
     */
    async find(query, pageNum = 0, pageSize = 8) {
        return this.ctx.model.Resource.find(query)
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 搜索资源
     */
    async search(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Resource.find(query)
        .populate('questionId')
        .populate('categoryId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /***
     *  查找最最新的制定数量的资源
     */
    async findByNum(pageSize) {
        let pageNum = 0;
        return this.ctx.model.Resource.find({})
        .populate('questionId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    } 

    /**
     * 查找一个资源
     */
    async findOne(query) {
        return this.ctx.model.Resource.findOne(query).exec();
    }

    /*
     * 根据资源Id查找资源
     * @param {Object} obj
     */
    async getResourceById(ResourceId) {
        return this.ctx.model.Resource.findById(ResourceId)
        .populate('questionId')
        .exec();
    }


    /**
     * 更新资源信息
     */
    async update(ResourceId, updateInfo) {
        if (!ResourceId) {
            return;
        }
        const query = { _id: ResourceId };
        const update = updateInfo;
        return this.ctx.model.Resource.update(query, update).exec();
    }

    /**
     * 通过资源Id删除资源
     */
    async remove(ResourceId) {
        return this.ctx.model.Resource.findOneAndRemove({
            _id: ResourceId
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Resource.count(query).exec();
    }
}

module.exports = ResourceService;
