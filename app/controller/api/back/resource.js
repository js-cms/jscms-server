/**
 * 后台资源相关接口
 */

'use strict';

const BaseController = require('../base');
const path = require('path');
const fs = require('fs-extra');

class ResourceController extends BaseController {

  /**
   * 创建资源
   */
  async create() {
    const {
      ctx
    } = this;
    ctx.body = 'todo';
  }

  /**
   * 获取资源列表
   */
  async list() {
    const {
      ctx,
      service,
      config
    } = this;
    await this.decorator({
      get: {
        type: {
          type: 'Number',
          f: true,
          r: true
        },
        keyword: {
          type: 'String',
          f: true,
          r: false
        }
      }
    });

    const type = this.params.type;
    const keyword = this.params.keyword;

    let {
      pageSize,
      pageNumber
    } = ctx.helper.getPaging(ctx.query);

    let query = {
      '$and': []
    };
    if (type) query.$and.push({
      type: type
    });
    if (keyword) query.$and.push({
      filename: {
        $regex: new RegExp(keyword, 'i')
      }
    });

    //获取列表
    let findRes = await service.api.back.resource.find(query, pageNumber, pageSize);
    let list = [];

    for (const item of findRes) {
      let url = '';
      if (item.store === 1) {
        url = `${ctx.origin}${config.constant.directory.JSCMS_URL_UPLOAD}/${item.filename}`
      } else {
        url = item.filename;
      }
      list.push({
        createTime: item.createTime,
        filename: item.filename,
        url: url,
        remarks: item.remarks,
        store: item.store,
        type: item.type,
        _id: item._id
      });
    }

    //获取资源总数
    let total = await service.api.back.resource.count(query);

    //输出结果
    this.throwCorrect({
      list,
      total: total
    });
  }

  /**
   * 删除资源
   */
  async delete() {
    const {
      service,
      config
    } = this;
    await this.decorator({
      post: {
        id: {
          n: '资源id',
          type: 'ObjectId',
          f: true,
          r: true
        },
        filename: {
          type: 'String',
          f: true,
          r: true
        }
      }
    });

    const id = this.params.id;
    const filename = this.params.filename.replace(/\//g, '').replace(/\\/g, '');

    let msg = '';

    //本地地址
    let target = path.join(config.baseDir, `${config.constant.directory.JSCMS_UPLOAD}/${filename}`);

    //删除文件
    if (!fs.existsSync(target)) {
      msg = '，资源文件不存在';
    } else {
      fs.removeSync(target);
    }

    //删除数据库记录
    const deleteRes = await service.api.back.resource.remove({
      _id: id
    });

    if (deleteRes) {
      this.throwCorrect({}, '资源信息删除完成' + msg);
    } else {
      this.throwError('资源删除失败');
    }
  }

  /**
   * 模糊删除
   */
  async fuzzyDelete(url) {
    const {
      service,
      config
    } = this;
    const filename = path.basename(url);
    let msg = '';

    //本地地址
    let target = path.join(config.baseDir, `${config.constant.directory.JSCMS_UPLOAD}/${filename}`);

    //删除文件
    if (!fs.existsSync(target)) {
      msg = '，资源文件不存在';
    } else {
      fs.removeSync(target);
    }

    //删除数据库记录
    const result = await service.api.back.resource.removeByFilename(filename);

    return Boolean(result);
  }

  /**
   * 资源处理器
   */
  async uploadHandler(file) {
    const {
      ctx,
      service,
      config
    } = this;
    const suffix = ctx.helper.getFileSuffix(file.filename);
    const nowTimestamp = (new Date()).getTime();
    const newFileName = `${nowTimestamp}.${suffix}`;
    const whiteList = ['png', 'jpg', 'jpeg', 'git', 'bmp', 'ico'];

    //判断文件类型
    if (!whiteList.includes(suffix)) {
      return {
        code: 1,
        msg: '不允许上传此类型的文件'
      }
    }

    //组装本地地址
    let target = path.join(config.baseDir, `${config.constant.directory.JSCMS_UPLOAD}/${newFileName}`);

    //将文件移动到本地地址
    const result = await new Promise((resolve, reject) => {
      fs.move(file.filepath, target, err => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      })
    });

    //判断文章操作的结果
    if (result === false) {
      //失败，返回错误
      return {
        code: 1,
        msg: '上传失败，未知错误。'
      }
    } else {
      //成功，删除临时文件
      fs.remove(file.filepath, err => {
        if (err) return console.error(err);
      });
    }

    //组装资源网址
    const webUrl = `${ctx.origin}${config.constant.directory.JSCMS_URL_UPLOAD}/${newFileName}`;

    //写入资源表
    let createRessoureRes = await service.api.back.resource.create({
      type: 1,
      store: 1,
      filename: newFileName,
      remarks: webUrl
    });
    if (createRessoureRes) {
      return {
        code: 0,
        msg: '上传成功',
        data: {
          filename: newFileName,
          imageUrl: webUrl
        }
      }
    } else {
      return {
        code: 1,
        msg: '资源创建失败'
      }
    }
  }

  /**
   * 标准资源上传控制器 
   */
  async uploader() {
    const { ctx } = this;
    let originalImageUrl = ctx.request.body.originalImageUrl;
    let files = ctx.request.files;
    let errors = [];
    let results = [];

    for (const file of files) {
      let result = await this.uploadHandler(file);
      if (result.code === 1) {
        errors.push(result);
      } else {
        results.push(result.data);
      }
    }

    if (errors.length) {
      this.throwError(errors[0].msg);
    } else if (results.length) {
      let deleteRes = '';
      if (originalImageUrl) deleteRes = await this.fuzzyDelete(originalImageUrl);
      console.log('deleteRes', deleteRes);
      this.throwCorrect(results[0], '上传成功');
    } else {
      this.throwError('未知错误');
    }
  }

  /**
   * wangeditor资源上传控制器 
   */
  async wangeditorUploader() {
    const { ctx } = this;
    let files = ctx.request.files;
    let errors = [];
    let results = [];

    for (const file of files) {
      let result = await this.uploadHandler(file);
      if (result.code === 1) {
        errors.push(result);
      } else {
        results.push(result.data);
      }
    }

    if (errors.length) {
      this.throwError(errors[0].msg);
    } else if (results.length) {
      let urls = results.map(i => i.imageUrl);
      ctx.body = {
        errno: 0,
        data: urls
      };
    } else {
      this.throwError('未知错误');
    }
  }
}

module.exports = ResourceController;