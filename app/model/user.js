'use strict';

const path = require('path');
const configDirectory = require('../../config/directory');
const configTheme = require('../../config/theme');
const THEME_IMAGES = path.join(configDirectory.JSCMS_URL_THEME_STATIC, configTheme.THEME_NAME, '/static/images')

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  /**
   * 用户表
   */
  const UserSchema = new Schema({
    email: { type: String }, //邮箱作为登陆用户名
    password: { type: String }, //密码
    nickname: { type: String, default: "刺梨爱好者" }, //昵称
    location: { type: String }, //所在地    
    signature: { type: String }, //个人签名
    avatar: { type: String, default: THEME_IMAGES }, //头像
    power: { type: Array }, //权限
    score: { type: Number, default: 0 }, //积分

    about: { type: String, }, //关于用户

    createTime: { type: Number },
    updateTime: { type: Number },

    active: { type: Boolean, default: true }, //是否已经激活
  });

  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ score: -1 });

  UserSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  UserSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model('User', UserSchema);
};
