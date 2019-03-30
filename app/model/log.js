'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/log');
const model = new Model({
  name: 'Log',
  displayName: '日志'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  /*
  * 日志记录表
  */
  let schema = model.to.mongoose(Schema);
  const LogSchema = new Schema(schema);

  LogSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  LogSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, LogSchema);
};
