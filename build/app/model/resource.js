'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 资源表
    */
    const ResourceSchema = new Schema({
        type: { type: Number, default: 1 }, //资源类型：1、图片。
        remarks: { type: String, default: "这是资源的备注" }, //资源备注
        url: { type: String }, //资源链接地址

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    ResourceSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    ResourceSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Resource', ResourceSchema);
};
