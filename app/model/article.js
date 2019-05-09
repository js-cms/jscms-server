/**
 * 文章表
 */

'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/article');
const model = new Model({
  name: 'Article',
  displayName: '文章'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = mongoose.Types;


  let schema = model.to.mongoose(Types);
  const ArticleSchema = new Schema(schema);

  ArticleSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  ArticleSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, ArticleSchema);
};