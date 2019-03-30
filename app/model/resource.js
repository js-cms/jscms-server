'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/resource');
const model = new Model({
  name: 'Resource',
  displayName: '日志'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  /*
  * 资源表
  */
  let schema = model.to.mongoose(Schema);
  const ResourceSchema = new Schema(schema);

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

  return mongoose.model(model.model.name, ResourceSchema);
};
