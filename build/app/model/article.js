'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 文章表
    */
    const ArticleSchema = new Schema({
        serialNumber: { type: Number, default: 0 }, //文章序号，唯一。
        
        categoryId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category'
        }, //所属分类对象

        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }, //所属用户id

        type: { type: Number }, //文章类型：1.单封面文章 2.多封面文章

        title: { type: String }, //文章的标题
        keywords: { type: Array }, //文章关键字/标签
        description: { type: String }, //文章摘要/描述

        poster: { type: String }, //文章封面

        mdContent: { type: String }, //文章markdown内容
        htContent: { type: String }, //文章html内容

        topType: { type: Number, default: 0 }, //置顶方式 0、无置顶 1、主要置顶 2、次要置顶

        likeCount: { type: Number, default: 0 }, //点赞数量
        commentCount: { type: Number, default: 0 }, //评论数量
        visNumber: { type: Number, default: 0 }, //浏览数量

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    ArticleSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    ArticleSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Article', ArticleSchema);
};
