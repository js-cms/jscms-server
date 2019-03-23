'use strict';

/**
 * modelman model: 分类表
 */

module.exports = {
  order: { n: '排序权重', type: 'Number', f: true, t: true, r: false, d: 0 }, //排序权重。
  name: { n: '中文类名', type: 'String',  f: true, t: true, r: true}, //分类的中文类名，用于展示。
  alias: { n: '英文类名', type: 'String', f: true, t: true, r: true }, //分类的英文名，用于在url上展示。
  title: { n: '网页标题', type: 'String', f: true, t: true, r: true }, //网页标题
  keywords: { n: '网页关键字', type: 'String', f: true, t: true, r: true }, //网页关键字
  description: { n: '网页描述', type: 'String', f: true, t: false, r: true }, //网页描述
  articleCount: { n: '文章数', type: 'Number',  f: true, t: true, d: 0 }, //文章数
  createTime: { n: '创建时间', type: 'Timestamp',f: false, t: true }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', f: false, t: true } //更新时间
}
