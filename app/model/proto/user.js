/**
 * modelman model: 用户表
 */

'use strict';

module.exports = {
  phone: { n: '手机号', type: 'Number', f: true, t: false, r: false }, //手机号
  email: { n: '邮箱', type: 'Email', f: true, t: true, r: true }, //邮箱作为登录用户名
  password: { n: '密码密文', type: 'String', f: true, t: false, r: true }, //密码

  nickname: { n: '昵称', type: 'String', f: true, t: true, r: false, d: '匿名' }, //昵称
  sex: { n: '性别', type: 'Number', f: true, t: false, r: true, d: 1, extra: {comType: 'select', options: '1:男,2:女'}}, //性别 1:男,2:女
  birthday: { n: '生日', type: 'Timestamp', f: true, t: false, r: false, d: 0, extra: {comType: 'select'}}, //生日
  qq: { n: 'qq', type: 'Number', f: true, t: false, r: false, d: 0 }, //qq号
  wx: { n: '微信', type: 'String', f: true, t: false, r: false }, //微信号
  
  work: { n: '工作', type: 'String', f: true, t: false, r: false }, //工作
  location: { n: '地址', type: 'String', f: true, t: true, r: false }, //所在地    
  tags: { n: '个性化标签', type: 'Array', f: true, t: false, r: false, d: ['懒'] }, //个人签名
  avatar: { n: '头像地址', type: 'Url', f: true, t: false, r: false }, //头像
  about: { n: '关于', type: 'String', f: true, t: false, r: false, extra: {comType: 'textarea'}}, //关于用户

  // 二维码设置
  qrWx: { n: '用户的微信二维码', type: 'String', f: true, t: false, r: false, p: '用户微信二维码的图片地址'}, // 用户微信二维码的图片地址
  qrWxpay: { n: '微信收款二维码', type: 'String', f: true, t: false, r: false, p: '微信收款二维码的图片地址'}, // 微信收款二维码的图片地址
  qrWxpub: { n: '微信公众号二维码', type: 'String', f: true, t: false, r: false, p: '微信公众号二维码的图片地址'}, // 微信公众号二维码的图片地址
  qrAlipay: { n: '支付宝收款二维码', type: 'String', f: true, t: false, r: false, p: '支付宝收款二维码的图片地址'}, // 支付宝收款二维码的图片地址
  qrUnionpay: { n: '银联云闪付收款二维码', type: 'String', f: true, t: false, r: false, p: '银联云闪付收款二维码的图片地址'}, // 银联云闪付收款二维码的图片地址

  powers: { n: '权限', type: 'Array', f: true, t: false, r: false, d: [] }, //权限
  score: { n: '积分', type: 'Number', f: true, t: true, r: false, d: 0 }, //积分
  active: { n: '激活状态', type: 'Boolean', f: true, t: true, r: false, default: true }, //是否已经激活
  createTime: { n: '创建时间', type: 'Timestamp', t: true, f: false }, //创建时间
  updateTime: { n: '更新时间', type: 'Timestamp', t: true, f: false } //更新时间
}
