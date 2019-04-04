'use strict';

/**
 * modelman model: 页面表
 */

module.exports = {
  title: { n: '页面标题', type: 'String', f: true, t: true, r: true }, //页面标题
  keywords: { n: '页面关键字', type: 'String', f: true, t: true, r: true  }, //页面关键字
  description: { n: '页面描述', type: 'String', f: true, t: true, r: true }, //页面描述
  name: { n: '页面名称', type: 'String', f: true, t: true, r: true  }, //页面名称
  alias: { n: '页面别名', type: 'String', f: true, t: true, r: true  }, //页面别名
  html: { n: '页面html内容', type: 'String', f: true, t: false, r: true, extra: {comType: 'codeEdit', lang: 'html'}}, //页面html内容
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
