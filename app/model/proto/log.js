/**
 * modelman model: 日志记录表
 */

'use strict';

module.exports = {
  type: { n: '日志类型', type: 'Number', f: false, t: true, d: 0, extra: {options: '0:其他类型,1:访问日志,2:搜索记录,3:后台操作'}}, //日志类型：0、其他类型 1、访问日志 2、搜索记录 3、后台操作
  info: { n: '日志信息', type: 'Any', f: false, t: false }, //日志信息
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
