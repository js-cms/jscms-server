'use strict';

const Model = require('modelman').Model;
const proto = require('./proto/comment');
const model = new Model({
  name: 'Comment',
  displayName: '评论'
});
model.assign(proto);

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const Types = mongoose.Types;

  /*
  * 评论表
  */
  let schema = model.to.mongoose(Types);
  const CommentSchema = new Schema(schema);

  CommentSchema.pre('save', function (next) {
    const now = (new Date()).getTime();

    this.createTime = now;
    this.updateTime = now;
    next();
  });

  CommentSchema.pre('update', function (next) {
    const now = (new Date()).getTime();
    this.updateTime = now;
    next();
  });

  return mongoose.model(model.model.name, CommentSchema);
};
