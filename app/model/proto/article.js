'use strict';

/**
 * modelman model: 文章表
 */

module.exports = {
  isIndepMeta: { n: '开启独立元信息', type: 'Boolean', f: true, t: false, r: true, d: false }, // 是否需要独立元信息
  isIndepUser: { n: '开启独立发布者', type: 'Boolean', f: true, t: false, r: true, d: false }, // 是否需要独立发布者
  indepMetaTitle: { n: '元信息标题', type: 'String', f: true, t: false, r: false }, // 独立元信息标题
  indepMetaKeywords: { n: '元信息关键字', type: 'String', f: true, t: false, r: false }, // 独立元信息关键字
  indepMetaDescription: { n: '元信息描述', type: 'String', f: true, t: false, r: false }, // 独立元信息描述
  indepUserAvatar: { n: '发布者头像', type: 'Url', f: true, t: false, r: false }, // 独立发布者头像地址
  indepUserNickname: { n: '发布者昵称', type: 'String', f: true, t: false, r: false }, // 独立发布者昵称
  indepUserAbout: { n: '发布者介绍', type: 'String', f: true, t: false, r: false }, // 独立发布者介绍

  numberId: { n: '文章序号', type: 'Number', f: false, t: true }, //文章序号
  title: { n: '文章标题', type: 'String', f: true, t: true, r: true, p: '文章的标题。' }, //文章标题
  categoryId: { n: '所属分类', type: 'ObjectId', f: true, t: true, ref: 'Category', extra: {displayField: 'name', comType: 'select', options: 'categories'}}, //所属分类对象
  userId: { n: '发布用户', type: 'ObjectId', f: false, t: true, ref: 'User', extra: {displayField: 'nickname'}}, //发布用户
  type: { n: '文章类型', type: 'Number', f: true, r: true, d: 1, extra: {comType: 'select', options: '1:单封面文章'}}, //文章类型：1.单封面文章
  topType: { n: '置顶方式', type: 'Number', f: true, r: true, d: 0, extra: {comType: 'select', options: '0:无置顶,1:主要置顶,2:次要置顶'}}, //置顶方式 0、无置顶 1、主要置顶 2、次要置顶
  keywords: { n: '文章关键字', type: 'Array', f: true, r: true, d: [], extra: {comType: 'tagInput'}}, //文章关键字
  description: { n: '文章摘要', type: 'String', f: true, r: true, p: '文章的摘要，用于元信息或页面头部渲染。', min: 10, max: 200, extra: {comType: 'textarea'}}, //文章摘要
  poster: { n: '文章封面', type: 'Url', f: true, r: true, p: '图片的网址。' }, //文章封面

  contentType: { n: '内容类型', type: 'Number', f: true, t: false, r: true, d: 0, extra: {comType: 'select', options: '0:Markdown,1:html代码2:富文本编辑器'}}, //文章内容类型  //0:Markdown,1:html代码2:富文本编辑器
  content: { n: '前端展示内容', type: 'String', f: false, t: false, r: false }, //前端展示的html内容。
  mdContent: { n: 'markdown', type: 'String', f: true, t: false, r: false, extra: {comType: 'markdown'}}, //markdown代码
  htmlContent: { n: 'html', type: 'String', f: true, t: false, r: false, extra: {comType: 'codeEdit'}}, //纯html代码
  richContent: { n: 'richtext', type: 'String', f: true, t: false, r: false, extra: {comType: 'richText'}}, //富文本html代码
  
  likeTotal: { n: '点赞数量', type: 'Number', f: false, d: 0 }, //点赞数量
  commentTotal: { n: '评论数量', type: 'Number', f: false, d: 0 }, //评论数量
  visTotal: { n: '浏览数量', type: 'Number', f: false, d: 0 }, //浏览数量
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
