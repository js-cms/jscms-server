/**
 * modelman model: 评论表
 */

'use strict';

module.exports = {
  shield: { n: '是否屏蔽', type: 'Boolean', f: true, t: true, d: false , extra: {comType: 'radio', options: 'true:是,false:否'} }, //是否屏蔽
  numberId: { n: '评论序号', type: 'Number', f: false, t: true }, // 评论序号
  commentId: { n: '所属评论id', type: 'String', f: false, t: false, r: false }, // 所属评论。
  articleId: { n: '所属文章id', type: 'ObjectId', f: false, t: true, r: true, ref: 'Article', extra: {displayField: 'title'}}, // 所属文章
  userAuthor: { n: '发布用户', type: 'Object', f: false, t: true, d: {}, ref: 'User', extra: {displayField: 'nickname'} }, // 发布用户
  userReplied: { n: '被回复用户', type: 'Object', f: false, t: true, d: {}, ref: 'User', extra: {displayField: 'nickname'} }, // 被回复用户
  articleNumberId: { n: '所属文章序号', type: 'Number', f: true, t: true, r: true, d: 0 }, // 所属文章序号
  mdContent: { n: '评论内容', type: 'String', f: true, t: false, r: true, p: '评论的内容，支持markdown', extra: {comType: 'textarea'}}, // 评论的markdown内容
  htContent: { n: 'html代码', type: 'String', f: false, t: false }, // 评论的html代码
  likeUserIds: { n: '点赞用户', type: 'Array' }, // 点赞用户
  replyTotal: { n: '回复数量', type: 'Number', default: 0 }, // 回复数量
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, // 创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } // 更新时间
}
