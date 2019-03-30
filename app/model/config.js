'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/config');
const model = new Model({
  name: 'Config',
  displayName: '配置'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = mongoose.Types;

  /*
  * 站点配置表
  */
  let schema = model.to.mongoose(Types);
  const ConfigSchema = new Schema(schema);

  ConfigSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  ConfigSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, ConfigSchema);
};
