'use strict';

/**
 * modelman model: 资源表
 */

module.exports = {
  type: { n: '资源类型', type: 'Number', t: false, f: false, d: 1, extra: {options: '1:图片,2:音频,3:视频,4:文件'}}, //资源类型：1:图片,2:音频,3:视频,4:文件
  store: { n: '存储方式', type: 'Number', t: false, f: false, d: 1, extra: {options: '1:本地,2:远程'}}, //存储方式：1:本地,2:远程
  filename: { n: '资源文件名', type: 'String', t: true, f: true, r: true }, //资源文件名或者链接地址
  remarks: { n: '资源备注', type: 'String', t: true, f: false, r: false, d: "这是资源的备注"}, //资源备注
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
