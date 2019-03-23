'use strict';

const Model = require('modelman').Model;
const pageObject = require('../modelman/page');
const pageModel = new Model({
  name: 'Page',
  displayName: '文章'
});
pageModel.assign(pageObject);
let schema = pageModel.to.mongoose();

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

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

  return mongoose.model(pageModel.model.name, PageSchema);
};
