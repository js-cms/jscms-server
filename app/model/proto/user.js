'use strict';

/**
 * modelman model: 用户表
 */

module.exports = {
  email: { n: '邮箱', type: 'Email', f: true, t: true, r: true }, //邮箱作为登陆用户名
  password: { n: '密码', type: 'String', f: true, t: false, r: true }, //密码
  nickname: { n: '昵称', type: 'String', f: true, t: true, r: false, d: '匿名' }, //昵称
  location: { n: '地址', type: 'String', f: true, t: true, r: false }, //所在地    
  signature: { type: 'String', f: true, t: true, r: false , d: '这个人很懒。'}, //个人签名
  avatar: { type: 'String', f: true, t: false, r: false }, //头像
  power: { type: 'Array', f: false, t: true, r: false, d: [] }, //权限
  score: { type: 'Number', f: false, t: true, r: false, d: 0 }, //积分
  about: { type: 'String', f: true, t: false, r: false }, //关于用户
  active: { type: 'Boolean', f: false, t: true, r: false, default: true }, //是否已经激活
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
