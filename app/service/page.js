'use strict';

const Service = require('egg').Service;

class PageService extends Service {

    /*
     * 新建页面
     */
    async create(PageObj) {
        const Page = new this.ctx.model.Page();
        for (const key in PageObj) {
            Page[key] = PageObj[key];
        }
        return Page.save();
    }

    /*
     * 根据关键字，获取一组页面
     * Callback:
     * - err, 数据库异常ß
     * - Pages, 页面列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[Pages]} 承载页面列表的 Promise 对象
     */
    async getPagesByQuery(query, opt) {
        return this.ctx.model.Page.find(query, '', opt).exec();
    }

    /**
     * 查询页面
     */
    async find(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Page.find(query)
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 查找一个页面
     */
    async findOne(query) {
        return this.ctx.model.Page.findOne(query).exec();
    }

    /*
     * 根据页面Id查找页面
     * @param {Object} obj
     */
    async getPageById(PageId) {
        return this.ctx.model.Page.findById(PageId)
        .populate('questionId')
        .exec();
    }


    /**
     * 更新页面信息
     */
    async update(PageId, updateInfo) {
        if (!PageId) {
            return;
        }
        const query = { _id: PageId };
        const update = updateInfo;
        return this.ctx.model.Page.update(query, update).exec();
    }

    /**
     * 通过页面Id删除页面
     */
    async remove(PageId) {
        return this.ctx.model.Page.findOneAndRemove({
            _id: PageId
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Page.count(query).exec();
    }
    
}

module.exports = PageService;
