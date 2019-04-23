'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs-extra');

const getFileSuffix = function (filename) {
  let tempArr = filename.split('.');
  const suffix = tempArr[tempArr.length - 1];
  return suffix;
}

class ResourceController extends Controller {

  /**
   * 创建资源
   */
  async create() {
    const { ctx, service, config } = this;
    ctx.body = 'hi';
  }

  /**
   * 获取资源列表
   */
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const type = ctx.query.type;
    let { pageSize, pageNumber } = ctx.helper.getPaging(ctx.query);

    let where = {};
    if (type) {
      where.type = type;
    }

    //获取列表
    let findRes = await service.resource.find(where, pageNumber, pageSize);
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
    let totalRes = await service.resource.count(where);

    ctx.body = {
      code: 0,
      msg: '查询成功',
      data: {
        list,
        total: totalRes
      }
    };
  }

  /**
   * 删除资源
   */
  async delete() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }
    const id = ctx.request.body.id;
    const filename = ctx.request.body.filename.replace(/\//g, '').replace(/\\/g, '');
    let msg = '';

    //本地地址
    let target = path.join(config.baseDir, `${config.constant.directory.JSCMS_UPLOAD}/${filename}`);

    if (!fs.existsSync(target)) {
      msg = '，资源文件不存在';
    } else {
      fs.removeSync(target);
    }

    if (!id) {
      return ctx.helper.throwError(ctx, '参数错误');
    }

    const deleteRes = await service.resource.remove({_id: id});

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: '资源信息删除完成' + msg
      }
    } else {
      return ctx.helper.throwError(ctx, '资源删除失败');
    }
  }

  /*
   * 资源上传控制器 
   */
  async uploader() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, '你没有登陆', 403);
    }

    const file = ctx.request.files[0];
    const suffix = getFileSuffix(file.filename);
    const nowTimestamp = (new Date()).getTime();
    const newFileName = `${nowTimestamp}.${suffix}`;
    const whiteList = ['png', 'jpg', 'jpeg', 'git', 'bmp'];
    if (!whiteList.includes(suffix)) {
      ctx.body = {
        code: 1,
        msg: '不允许上传此类型的文件'
      };
      return false;
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
      ctx.body = {
        code: 1,
        msg: '上传失败，未知错误！'
      };
      return false;
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
      ctx.body = {
        code: 0,
        msg: '上传成功',
        data: {
          filename: newFileName,
          imageUrl: webUrl
        }
      };
    } else {
      ctx.body = {
        code: 1,
        msg: '资源创建失败'
      };
    }
  }
}

module.exports = ResourceController;
