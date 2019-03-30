'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/category');
const model = new Model({
  name: 'Category',
  displayName: '分类'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  /*
  * 分类表
  */
  let schema = model.to.mongoose(Schema);
  const CategorySchema = new Schema(schema);

  CategorySchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  CategorySchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, CategorySchema);
};
