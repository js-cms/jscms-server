'use strict';

/**
 * modelman model: 用户表
 */

module.exports = {
  phone: { n: '手机号', type: 'Number', f: false, t: false, r: false }, //手机号
  email: { n: '邮箱', type: 'Email', f: true, t: true, r: true }, //邮箱作为登陆用户名
  password: { n: '密码密文', type: 'Password', f: true, t: false, r: true }, //密码

  nickname: { n: '昵称', type: 'String', f: true, t: true, r: false, d: '匿名' }, //昵称
  sex: { n: '性别', type: 'Number', f: true, t: false, r: true, d: 1, extra: {comType: 'select', options: '1:男,2:女'}}, //性别 1:男,2:女
  birthday: { n: '生日', type: 'Timestamp', f: true, t: false, r: false, d: 0 }, //生日
  qq: { n: 'qq', type: 'Number', f: true, t: false, r: false, d: 0 }, //qq号
  wx: { n: '微信', type: 'String', f: true, t: false, r: false }, //微信号
  
  work: { n: '工作', type: 'String', f: true, t: true, r: false }, //工作
  location: { n: '地址', type: 'String', f: true, t: true, r: false }, //所在地    
  tags: { n: '个性化标签', type: 'Array', f: true, t: true, r: false, d: ['懒'] }, //个人签名
  avatar: { n: '头像地址', type: 'String', f: true, t: false, r: false }, //头像
  about: { n: '关于', type: 'String', f: true, t: false, r: false, extra: {comType: 'textarea'}}, //关于用户

  power: { n: '权限', type: 'Array', f: false, t: false, r: false, d: [] }, //权限
  score: { n: '积分', type: 'Number', f: false, t: true, r: false, d: 0 }, //积分
  active: { n: '激活状态', type: 'Boolean', f: false, t: true, r: false, default: true }, //是否已经激活
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
