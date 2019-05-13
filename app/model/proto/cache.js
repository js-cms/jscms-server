/**
 * modelman model: 硬盘缓存数据表
 */

'use strict';

module.exports = {
  type: { n: '缓存类型', type: 'String', f: false, t: false, r: true, d: '_default_' }, // 缓存类型
  name: { n: '缓存名称', type: 'String', f: true, t: true, r: true }, // 缓存名称
  info: { n: '缓存信息', type: 'Any', f: true, t: false, r: false }, // 缓存信息
  createTime: { n: '创建时间', type: 'Timestamp', f: false, t: true }, // 创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', f: false, t: true } // 更新时间
}
