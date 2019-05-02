'use strict';

const path = require('path');
const fs = require('fs-extra');

const BaseController = require('./base');

class ResourceController extends BaseController {

  /**
   * @description 创建资源
   */
  async create() {
    const { ctx } = this;
    ctx.body = 'todo';
  }

  /**
   * @description 获取资源列表
   */
  async list() {
    const { ctx, service, config } = this;
    this.decorator({
      login: true,
      get: {
        type: { type: 'Number', f: true, r: true },
        keyword: { type: 'String', f: true, r: false }
      }
    });

    const type = this.params.type;
    const keyword = this.params.keyword;

    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    let query = { '$and': [] };
    if (type) query.$and.push({type: type});
    if (keyword) query.$and.push({ filename: { $regex: new RegExp(keyword, 'i') }});

    //获取列表
    let findRes = await service.resource.find(query, pageNumber, pageSize);
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
    let total = await service.resource.count(query);

    //输出结果
    this.throwCorrect({
      list,
      total: total
    });
  }

  /**
   * @description 删除资源
   */
  async delete() {
    const { service, config } = this;
    this.decorator({
      login: true,
      post: {
        id: { type: 'ObjectId', f: true, r: true },
        filename: { type: 'String', f: true, r: true }
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
    const deleteRes = await service.resource.remove({_id: id});

    if (deleteRes) {
      this.throwCorrect({}, '资源信息删除完成' + msg); 
    } else {
      this.throwError('资源删除失败');
    }
  }

  /**
   * @description 资源上传控制器 
   */
  async uploader() {
    const { ctx, service, config } = this;
    this.decorator({
      login: true
    });

    const file = ctx.request.files[0];
    const suffix = ctx.helper.getFileSuffix(file.filename);
    const nowTimestamp = (new Date()).getTime();
    const newFileName = `${nowTimestamp}.${suffix}`;
    const whiteList = ['png', 'jpg', 'jpeg', 'git', 'bmp'];

    //判断文件类型
    if (!whiteList.includes(suffix)) {
      this.throwError('不允许上传此类型的文件');
    }

    //组装本地地址
    let target = path.join(this.config.baseDir, `${config.constant.directory.JSCMS_UPLOAD}/${newFileName}`);

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
      this.throwError('上传失败，未知错误');
    } else {
      //成功，删除临时文件
      fs.remove(file.filepath, err => {
        if (err) return console.error(err);
      });
    }
  
    //组装资源网址
    const webUrl = `${ctx.origin}${config.constant.directory.JSCMS_URL_UPLOAD}/${newFileName}`;

    //写入资源表
    let createRessoureRes = await service.resource.create({
      type: 1,
      store: 1,
      filename: newFileName,
      remarks: webUrl
    });

    if (createRessoureRes) {
      this.throwCorrect({
        filename: newFileName,
        imageUrl: webUrl
      }, '上传成功');
    } else {
      this.throwError('资源创建失败');
    }
  }
}

module.exports = ResourceController;
