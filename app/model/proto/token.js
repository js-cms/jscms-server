/**
 * modelman model: 用户token表
 */

'use strict';

module.exports = {
  token: { type: 'String' },
  userId: { type: 'String' },
  passwExpiry: { type: 'Timestamp' },
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
