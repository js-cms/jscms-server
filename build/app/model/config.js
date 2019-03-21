'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 站点配置表
    */
    const ConfigSchema = new Schema({

        name: { type: String }, //配置名称。
        alias: { type: String }, //英文别名
        info: { type: Object }, //配置信息

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    ConfigSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    ConfigSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Config', ConfigSchema);
};
