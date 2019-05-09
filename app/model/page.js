/**
 * 自定义页面表
 */

'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/page');
const model = new Model({
  name: 'Page',
  displayName: '自定义页面'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema
  const Types = mongoose.Types;

  let schema = model.to.mongoose(Types);
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

  return mongoose.model(model.model.name, PageSchema);
};