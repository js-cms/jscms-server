'use strict';

const Page = require('../public_model/Page.js')

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    let page = new Page(Schema);
    let schema = page.toMongooseSchema();

    /*
    * 自定义页面表
    */
    const PageSchema = new Schema(schema);

    PageSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    PageSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Page', PageSchema);
};