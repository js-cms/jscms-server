'use strict';

/**
 * modelman model: 分类表
 */

module.exports = {
  isIndepMeta: { n: '开启独立元信息', type: 'Boolean', f: true, t: false, r: true, d: false }, // 是否需要独立元信息
  indepMetaTitle: { n: '元信息标题', type: 'String', f: true, t: false, r: false }, // 独立元信息标题
  indepMetaKeywords: { n: '元信息关键字', type: 'String', f: true, t: false, r: false }, // 独立元信息关键字
  indepMetaDescription: { n: '元信息描述', type: 'String', f: true, t: false, r: false, extra: {comType: 'textarea'} }, // 独立元信息描述

  poster: { n: '分类封面', type: 'Url', f: true, t: false, r: true }, // 分类封面
  order: { n: '排序权重', type: 'Number', f: true, t: true, r: false, d: 0 }, // 排序权重。
  name: { n: '中文分类名称', type: 'String',  f: true, t: true, r: true, p: '中文分类名称，用于在页面中展示。'}, // 中文分类名称，用于在页面中展示。
  alias: { n: '英文分类别名', type: 'String', f: true, t: true, r: true, p: '英文分类别名，用于通过url访问分类列表。'}, // 英文分类别名，用于通过url访问分类列表。
  tags: { n: '分类标签', type: 'Array',  f: true, t: false, r: true, p: '分类标签', d: [], extra: {comType: 'tagInput'} }, // 分类标签
  intro: { n: '分类简介', type: 'String', f: true, t: false, r: true, p: '文章的摘要，用于元信息或页面头部渲染。', extra: {comType: 'textarea'} }, //分类简介
  
  articleTotal: { n: '文章数', type: 'Number',  f: false, t: true, r: false, d: 0 }, // 该分类的文章数
  createTime: { n: '创建时间', type: 'Timestamp',f: false, t: true }, // 创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', f: false, t: true } // 更新时间
}
