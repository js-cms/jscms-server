'use strict';

/**
 * 数据库操作封装
 */
class Db {

  constructor(Model) {
    this.Model = Model;
  }

  /*
   * 新建
   */
  async create(data) {
    let model = new this.Model();
    for (const key in data) {
      model[key] = data[key];
    }
    return model.save();
  }
}

module.exports = Db;
