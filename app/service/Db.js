'use strict';

const is = require('ispro');

/**
 * 获取当前时间
 */
const now = function() {
  return new Date().getTime();
}

/**
 * 数据库操作的统一封装，可以对操作日志记录等功能的拓展。
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
    model.updateTime = now();
    model.createTime = now();
    return model.save();
  }

  /**
   * 更新
   */
  async update(query, target) {
    target.updateTime = target.updateTime ? target.updateTime : now();
    return this.Model.update(query, target).exec();
  }

  /**
   * 删除
   */
  async remove(query) {
    return this.Model.remove(query).exec();
  }

  /**
   * 查询
   */
  async find(query) {
    return this.Model.find(query).exec();
  }

  /**
   * @description 填充默认值
   * @param {Object} object 目标对象
   * @param {Object} model modelman
   */
  parseModelman(object, model) {
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        const element = model[key];
        if (!object[key] && is.valid(element.d)) {
          object[key] = element.d;
        }
      }
    }
    return object;
  }
}

module.exports = Db;
