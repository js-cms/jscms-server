'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 日志记录表
    */
    const LogSchema = new Schema({
        type: { type: Number }, //日志类型：1、访问日志 2、搜索记录
        info: { type: Object }, //日志信息

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    LogSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    LogSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Log', LogSchema);
};
