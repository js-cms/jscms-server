'use strict';

const moment = require('moment');
const bcrypt = require('bcryptjs');

const utils = module.exports = {

  /**
   * @description 模版中时间戳转化日期格式
   * @param {Number} time 时间戳
   * @param {Number} type 类型
   */
  toDate(time, type) {
    if (type === 1 || !type) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    } else if (type === 2) {
      return moment(time).format('YYYY-MM-DD');
    }
  },

  /**
   * @description 加密密码
   * @param {String} str 明文
   */
  bhash(str) {
    return bcrypt.hashSync(str, 10);
  },

  /**
   * @description 比较密码和密文
   * @param {String} str 明文
   * @param {String} hash 密文
   */
  bcompare(str, hash) {
    if (!str || !hash) return false;
    return bcrypt.compareSync(str, hash);
  },

  /**
   * @description 随机数字
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   */
  randNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
  },

  /**
   * @description http转化为https
   * @param {String} url 网址
   */
  toHttps(url) {
    return url.replace("http://", "https://");
  },

  /**
   * @description 数组混合并去重
   * @param {*} argv 数组参数
   */
  mixinArray(...argv) {
    let arr = []
    argv.forEach((array)=>{
      arr = arr.concat(array);
    });
    return [...new Set(arr)];
  },

  /**
   * @description 截取字符串 中英文混合
   * @param {String} str	待处理字符串
   * @param {Number} len	截取字节长度 中文2字节 英文1字节
   */
  subString(str, len) {
    let regexp = /[^\x00-\xff]/g;// 正在表达式匹配中文
    // 当字符串字节长度小于指定的字节长度时
    if (str.replace(regexp, "aa").length <= len) {
      return str;
    }
    // 假设指定长度内都是中文
    let m = Math.floor(len / 2);
    for (let i = m, j = str.length; i < j; i++) {
      // 当截取字符串字节长度满足指定的字节长度
      if (str.substring(0, i).replace(regexp, "aa").length >= len) {
        return str.substring(0, i);
      }
    }
    return str;
  },

  /**
   * @description 获取分页参数
   * @param {Object} query 
   */
  getPaging(query) {
    let pageSize = Number(query.pageSize);
    let pageNumber = Number(query.pageNumber);
    pageSize = isNaN(pageSize) ? 10 : pageSize;
    pageNumber = isNaN(pageNumber) ? 0 : pageNumber;
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageNumber = pageNumber - 1;
    return {
      pageSize,
      pageNumber
    }
  },

  /**
   * @description 获取文件后缀
   * @param {String} filename 
   */
  getFileSuffix(filename) {
    let tempArr = filename.split('.');
    const suffix = tempArr[tempArr.length - 1];
    return suffix;
  },

  /**
   * @description 判断数组某个值是否部分匹配目标字符串
   * @param {Array} array 数组
   * @param {String} targetStr 目标值
   */
  includesPart(array, targetStr) {
    let has = false;
    array.forEach(item => {
      if (targetStr.indexOf(item) !== -1) {
        has = true;
      }
    });
    return has;
  }
};
