'use strict';

const path = require('path');
const Model = require('modelman').Model;

const configDirectory = require('../../config/constant/directory');
const configTheme = require('../../config/theme');
const THEME_IMAGES = path.join(configDirectory.JSCMS_URL_THEME_STATIC, configTheme.THEME_NAME, '/static/images')

const proto = require('./proto/user');
const model = new Model({
  name: 'User',
  displayName: '用户'
});
proto.avatar.default = THEME_IMAGES + '/user-default.jpeg';
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = mongoose.Types;

  /**
   * 用户表
   */
  let schema = model.to.mongoose(Types);
  const UserSchema = new Schema(schema);

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

  return mongoose.model(model.model.name, UserSchema);
};
