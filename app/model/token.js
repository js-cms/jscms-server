'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/token');
const model = new Model({
  name: 'Token',
  displayName: '标记'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = mongoose.Types;

  /**
   * 用户Token表
   */
  let schema = model.to.mongoose(Types);
  const TokenSchema = new Schema(schema);

  TokenSchema.index({ token: 1 }, { unique: true });

  TokenSchema.pre('save', function (next) {
    const now = (new Date()).getTime();
    const tomorrow = now + 1000 * 60 * 60 * 24;

    this.createTime = now;
    this.updateTime = now;
    this.passwExpiry = tomorrow;
    next();
  });

  TokenSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    const tomorrow = now + 1000 * 60 * 60 * 24;
    this.updateTime = now;
    this.passwExpiry = tomorrow;
    next();
  });

  return mongoose.model(model.model.name, TokenSchema);
};
