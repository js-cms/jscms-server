/**
 * modelman model: 评论表
 */

'use strict';

module.exports = {
  commentId: { n: '所属评论', type: 'String', f: false, t: false, r: false }, // 所属评论。
  articleId: { n: '所属文章', type: 'ObjectId', f: false, t: true, r: true, ref: 'Article', extra: {displayField: 'title'}}, // 所属文章
  userId: { n: '发布用户', type: 'ObjectId', f: false, t: true, ref: 'User', extra: {displayField: 'nickname'} }, // 发布用户
  articleNumberId: { n: '所属文章序号', type: 'Number', f: true, t: true, r: true, d: 0 }, // 所属文章序号

  mdContent: { n: '评论内容', type: 'String', f: true, t: false, r: true, p: '评论的内容，支持markdown', extra: {comType: 'textarea'}}, // 评论的markdown内容
  htContent: { n: 'html代码', type: 'String', f: false, t: false }, // 评论的html代码
  likeTotal: { n: '点赞数量', type: 'Number', default: 0 }, // 点赞数量
  replyTotal: { n: '回复数量', type: 'Number', default: 0 }, // 回复数量
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, // 创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } // 更新时间
}
