'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs-extra');

const sendToWormhole = require('stream-wormhole');

class ResourceController extends Controller {

  /**
   * 创建资源
   */
  async create() {
    const { ctx, service, config } = this;
    ctx.body = "hi";
  }

  /**
   * 获取资源列表
   */
  async list() {
    const { ctx, service, config } = this;
    if (!ctx.locals.currentUser.auth.isLogin) {
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }

    const type = ctx.query.type;
    let pageSize = Number(ctx.query.pageSize);
    let pageNumber = Number(ctx.query.pageNumber);
    pageSize = isNaN(pageSize) ? 8 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;

    let where = {};
    if (type) {
      where.type = type;
    }

    //获取列表
    let findRes = await service.resource.find(where, pageNumber, pageSize);
    //获取文章总数
    let totalRes = await service.resource.count(where);

    ctx.body = {
      code: 0,
      msg: "查询成功",
      data: {
        list: findRes,
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
      return ctx.helper.throwError(ctx, "你没有登陆", 403);
    }

    const id = ctx.request.body.id;
    const fileName = ctx.request.body.fileName;
    let msg = "";
    //本地地址
    let target = path.join(this.config.baseDir, `app/public/static/${fileName}`);
    if (!fs.existsSync(target)) {
      msg = "，资源文件不存在";
    } else {
      fs.removeSync(target);
    }

    if (!id) {
      return ctx.helper.throwError(ctx, "参数错误");
    }

    const deleteRes = await service.resource.remove(id);

    if (deleteRes) {
      ctx.body = {
        code: 0,
        msg: "资源信息删除完成" + msg
      }
    } else {
      return ctx.helper.throwError(ctx, "资源删除失败");
    }
  }

  /*
   * 资源上传控制器
   */
  async uploader() {
    const { ctx, service, config } = this;
    const stream = await ctx.getFileStream();
    const nowTimestamp = (new Date()).getTime();
    let tempArr = stream.filename.split(".");
    const suffix = tempArr[tempArr.length - 1];
    const newFileName = `${nowTimestamp}.${suffix}`;

    //组装本地地址
    let target = path.join(this.config.baseDir, `app/public/static/${newFileName}`);
    //写入本地硬盘
    const result = await new Promise((resolve, reject) => {
      const remoteFileStream = fs.createWriteStream(target);
      stream.pipe(remoteFileStream);
      let errFlag;
      remoteFileStream.on('error', err => {
        errFlag = true;
        sendToWormhole(stream);
        remoteFileStream.destroy();
        reject(err);
      });
      remoteFileStream.on('finish', async () => {
        if (errFlag) return;
        resolve({
          fileName: newFileName,
          name: stream.fields.name
        });
      });
    });
    let cUrl = ctx.origin + "/public/static/" + newFileName;

    //写入资源表
    let createRessoureRes = await service.resource.create({
      type: 1,
      remarks: newFileName,
      url: cUrl
    });

    if (createRessoureRes) {
      ctx.body = {
        code: 0,
        msg: "ok",
        data: {
          fileName: newFileName,
          imageUrl: cUrl
        }
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "资源创建失败"
      };
    }

  }
}

module.exports = ResourceController;