'use strict';

/**
 * modelman model: 站点配置表
 */

module.exports = {
  name: { n: '配置名称', type: 'String', f: false, t: false, d: '默认配置' }, //配置名称。
  alias: { n: '英文别名', type: 'String', f: false, t: false, d: 'defalut_config' }, //英文别名
  info: { n: '配置信息', type: 'Object', f: true, t: false, r: true }, //配置信息
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
