/**
 * 硬盘缓存表
 */

'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/cache');
const model = new Model({
  name: 'Cache',
  displayName: '缓存'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = Schema.Types;

  let schema = model.to.mongoose(Types);
  const CacheSchema = new Schema(schema);

  CacheSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  CacheSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, CacheSchema);
};