'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const now = (new Date()).getTime();

    /**
     * 用户Token表
     */
    const TokenSchema = new Schema({
        token: { type: String },
        userId: { type: String },

        passwExpiry: { type: Number },
        createTime: { type: Number },
        updateTime: { type: Number },
    });

    TokenSchema.index({ token: 1 }, { unique: true });

    TokenSchema.pre('save', function (next) {
        const now = (new Date()).getTime();
        const tomorrow = now + 1000 * 60 * 60 * 24;
        
        this.createTime = now;
        this.updateTime = now;
        this.passwExpiry = tomorrow;
        next();
    });

    TokenSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Token', TokenSchema);
};
