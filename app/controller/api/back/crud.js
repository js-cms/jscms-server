/**
 * 后台增删改查通用接口
 */

'use strict';

const Controller = require('egg').Controller;

const notFound = {
  code: 404,
  msg: 'not found!'
}

class CrudController extends Controller {

  /**
   * 查询符合条件的单条数据
   */
  async one() {
    const { ctx, service } = this;
    let params = this.getParams();
    if (params.code === 404) return params;
    let { model, query, data } = params;
    const result = await this._db('findOne', model, query);
    ctx.body = {
      model: model,
      query: query,
      data: data,
      result: result
    }
  }

  /**
   * 查询符合条件的多条数据
   */
  async list() {
    const { ctx, service } = this;
    let params = this.getParams();
    if (params.code === 404) return params;
    let { model, query, data } = params;
    const result = await this._db('find', model, query);
    const count = await this._db('count', model, query) || 0;
    ctx.body = {
      model: model,
      query: query,
      data: data,
      result: result,
      count: count
    }
  }

  /**
   * 创建一条或多条数据
   */
  async create() {
    const { ctx, service } = this;
    let params = this.getParams();
    if (params.code === 404) return params;
    let { model, query, data } = params;
    if (!data) {
      ctx.body = notFound;
    }
    data = !data.length ? [data] : data;
    const result = await this._db('insertMany', model, {
      data
    });
    ctx.body = {
      model: model,
      query: query,
      data: data,
      result: result
    }
  }

  /**
   * 更新符合条件的一条或多条数据
   */
  async update() {
    const { ctx, service } = this;
    let params = this.getParams();
    if (params.code === 404) return params;
    let { model, query, data } = params;
    if (!data) {
      ctx.body = notFound;
    }
    const result = await this._db('updateMany', model, {
      query,
      data
    });
    ctx.body = {
      model: model,
      query: query,
      data: data,
      result: result
    }
  }

  /**
   * 删除符合条件的一条或多条数据
   */
  async delete() {
    const { ctx, service } = this;
    let params = this.getParams();
    if (params.code === 404) return params;
    let { model, query, data } = params;
    const result = await this._db('remove', model, {
      query
    });
    ctx.body = {
      model: model,
      query: query,
      data: data,
      result: result
    }
  }

  getParams() {
    const { ctx } = this;
    let model = ctx.params.model;
    let query = ctx.query.query || ctx.request.body.query || undefined;
    let data = ctx.query.data || ctx.request.body.data || undefined;
    query = query ? JSON.parse(Buffer.from(query, 'base64').toString()) : undefined;
    data = data ? JSON.parse(Buffer.from(data, 'base64').toString()) : undefined;
    if (!model) {
      return notFound;
    }
    return {
      model,
      query,
      data
    }
  }

  /**
   * 模型操作
   */
  _db(method, model, opts = {
    query: '',
    data: ''
  }) {
    let Model = model[0].toUpperCase() + model.substr(1);
    let m = this.ctx.model[Model];
    let now = new Date().getTime();
    if (!m) {
      return notFound;
    }
    if ( method === 'findOne' ) {
      let chain = this.getPopulate(Model);
      let doc = m.findOne(opts.query);
      chain.forEach((p) => {
        doc = doc.populate(p);
      });
      return doc.exec();
    } else if ( method === 'find' ) {
      let query = opts.query || {};
      let pageSize = Number(this.ctx.query.pageSize);
      let pageNum = Number(this.ctx.query.pageNum);
      let chain = this.getPopulate(Model);
      if ( !isNaN(pageSize) && !isNaN(pageNum) ) {
        pageSize = !!isNaN(pageSize) ? 10 : pageSize;
        pageNum = !!isNaN(pageNum) ? 0 : pageNum;
        pageSize = pageSize < 0 ? 1 : pageSize;
        pageNum = pageNum < 1 ? 1 : pageNum;
        pageNum = pageNum - 1;
        let doc = m.find(opts.query);
        chain.forEach((p) => {
          doc = doc.populate(p);
        });
        return doc.sort({ 'createTime': -1 })
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
      } else {
        let doc = m.find(opts.query);
        chain.forEach((p) => {
          doc = doc.populate(p);
        });
        return doc.sort({ 'createTime': -1 }).exec();
      }
    } else if (method === 'count') {
      return m[method](opts.query).exec();
    } else if (method === 'insertMany') {
      let data = opts.data;
      data.forEach(i => {
        i.createTime = now;
        i.updateTime = now;
      });
      return m[method](data);
    } else if (method === 'updateMany') {
      let data = opts.data;
      data.updateTime = now;
      return m[method](opts.query, data)
        .exec();
    } else if (method === 'remove') {
      return m[method](opts.query)
        .exec();
    }
  }

  /**
   * 获取子查询字段
   */
  getPopulate(Model) {
    const proto = require('../../../model/proto/' + Model.toLowerCase() + '.js');
    let chain = [];
    for (const key in proto) {
      if (proto.hasOwnProperty(key)) {
        const m = proto[key];
        if (m.type === 'ObjectId' && m.ref) {
          chain.push(key);
        }
      }
    }
    return chain;
  }

}

module.exports = CrudController;
