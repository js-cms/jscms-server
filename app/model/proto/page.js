'use strict';

/**
 * modelman model: 页面表
 */

module.exports = {
  title: { n: '页面标题', type: 'String', f: true, t: true, r: true, p: '元信息标题，必填' }, //页面标题
  keywords: { n: '页面关键字', type: 'String', f: true, t: false, r: true, p: '元信息关键字，必填' }, //页面关键字
  description: { n: '页面描述', type: 'String', f: true, t: false, r: true, p: '元信息描述，必填' }, //页面描述
  name: { n: '页面名称', type: 'String', f: true, t: true, r: true, p: '页面名称，必填' }, //页面名称
  alias: { n: '页面别名', type: 'String', f: true, t: true, r: true, p: '页面别名，必填' }, //页面别名
  route: { n: '自定义路由', type: 'String', f: true, t: true, r: false, p: '自定义路由，非必填，不填不开启自定义路由，填写例如：/page.html' }, //自定义路由
  contentType: { n: '页面类型', type: 'String', f: true, t: false, r: false, p: '自定义页面类型，自定义路由时才有效，非必填，不填默认值：text/html; charset=utf-8' }, //自定义页面类型
  html: { n: '页面html内容', type: 'String', f: true, t: false, r: true, p: '页面的html内容', extra: {comType: 'codeEdit', lang: 'html'}}, //页面html内容
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
