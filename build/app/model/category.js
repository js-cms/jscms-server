'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 分类表
    */
    const CategorySchema = new Schema({

        order: { type: Number, default: 0 }, //排序权重。
        name: { type: String }, //分类的中文类名，用于展示。
        alias: { type: String }, //分类的英文名，用于在url上展示。
        title: { type: String }, //网页标题
        keywords: { type: String }, //网页关键字
        description:  { type: String }, //网页描述

        articleCount: { type: Number, default: 0 }, //分类的文章数。
        
        createTime: { type: Number },
        updateTime: { type: Number },
    });

    CategorySchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    CategorySchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Category', CategorySchema);
};
