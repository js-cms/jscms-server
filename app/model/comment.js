'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 评论表
    */
    const CommentSchema = new Schema({
        
        commentId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Comment'
        }, //所属评论

        articleId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Article'
        }, //所属文章

        authorNickname: { type: String, default: '匿名网友' }, //评论人昵称
        authorUrl: { type: String }, //作者网站
        authorEmail: { type: String }, //作者email
        authorAvatar: { type: String, default: "/public/theme/images/default.png" }, //作者头像

        mdContent: { type: String }, //评论的markdown内容
        htContent: { type: String }, //评论的html内容

        likeCount: { type: Number, default: 0 }, //点赞数量
        commentCount: { type: Number, default: 0 }, //回复评论数量

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    CommentSchema.pre('save', function (next) {
        const now = (new Date()).getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    CommentSchema.pre('update', function (next) {
        const now = (new Date()).getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Comment', CommentSchema);
};