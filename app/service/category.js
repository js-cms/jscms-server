'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

    /*
    * 新建分类
    */
    async create(categoryObj) {
        const category = new this.ctx.model.Category();
        for (const key in categoryObj) {
            category[key] = categoryObj[key];
        }
        return category.save();
    }

    /**
     * 查询分类
     */
    async find(query) {
        return this.ctx.model.Category.find(query).exec();
    }


    /**
     * 查询一个分类
     */
    async findOne(query) {
        return this.ctx.model.Category.findOne(query).exec();
    }

    /**
     * 通过分类id 获取分类
     * @param {String} categoryId 
    */
    async getCategoryById(categoryId) {
        return this.ctx.model.Category.findById(categoryId).exec();
    }

    /**
     * 通过分类中文名 获取分类
     * @param {String} categoryId 
    */
    async getCategoryByName(categoryName) {
        return this.ctx.model.Category.findOne({
            name: categoryName
        }).exec();
    }
    
    /**
     * 通过分类Id删除分类
     */
    async remove(categoryId) {
        return this.ctx.model.Category.findOneAndRemove({
            _id: categoryId
        }).exec();
    }

    /**
     * 更新分类信息
     */
    async update(categoryId, updateInfo) {
        if (!categoryId) {
            return;
        }
        const query = { _id: categoryId };
        const update = updateInfo;
        return this.ctx.model.Category.update(query, update).exec();
    }

    /**
     * 统计
     */
    async count() {
        return this.ctx.model.Category.count({}).exec();
    }
}

module.exports = CategoryService;