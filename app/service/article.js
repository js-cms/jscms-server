'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {

    /*
     * 新建文章
     */
    async create(ArticleObj) {
        const Article = new this.ctx.model.Article();
        for (const key in ArticleObj) {
            Article[key] = ArticleObj[key];
        }
        return Article.save();
    }

    /*
     * 根据关键字，获取一组文章
     * Callback:
     * - err, 数据库异常ß
     * - Articles, 文章列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[Articles]} 承载文章列表的 Promise 对象
     */
    async getArticlesByQuery(query, opt) {
        return this.ctx.model.Article.find(query, '', opt).exec();
    }

    /**
     * 查询文章
     */
    async find(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Article.find(query)
        .populate('userId')
        .populate('categoryId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 随机读取文章
     */
    async findRandom(num) {
        let total = await this.ctx.model.Article.count({}).exec(); //总数
        let promises = [];
        for (let i = 0; i < num; i++) {
            let skip = Math.round(Math.random() * (total - 1));
            let tempArr = await this.ctx.model.Article.find({}).skip(skip).limit(1).exec();
            promises.push(tempArr[0]);
        }
        return promises
    }


    /**
     * 获取按浏览量排名的文章
     */
    async findByHot(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Article.find(query)
        .sort({'visNumber':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 获取按评论量排名的文章
     */
    async findByComment(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Article.find(query)
        .sort({'commentCount':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 查找一个文章
     */
    async findOne(query) {
        return this.ctx.model.Article.findOne(query)
        .populate('userId')
        .exec();
    }

    /**
     * 
     * 查找所有文章
     */
    async findAll() {
        return this.ctx.model.Article.find({})
        .exec();
    }

    /**
     * 查找一个文章
     */
    async findOneForWWW(query) {
        return this.ctx.model.Article.findOne(query)
        .populate('userId')
        .populate('categoryId')
        .exec();
    }

    /*
     * 根据文章Id查找文章
     * @param {Object} obj
     */
    async getArticleById(ArticleId) {
        return this.ctx.model.Article.findById(ArticleId)
        .populate('questionId')
        .exec();
    }

    /**
     * 搜索文章
     */
    async search(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Article.find(query)
        .populate('userId')
        .populate('categoryId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /**
     * 更新文章信息
     */
    async update(ArticleId, updateInfo) {
        if (!ArticleId) {
            return;
        }
        const query = { _id: ArticleId };
        const update = updateInfo;
        return this.ctx.model.Article.update(query, update).exec();
    }

    /**
     * 通过文章Id删除文章
     */
    async remove(ArticleId) {
        return this.ctx.model.Article.findOneAndRemove({
            _id: ArticleId
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Article.count(query).exec();
    }
}

module.exports = ArticleService;
