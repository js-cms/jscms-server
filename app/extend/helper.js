'use strict';

const moment = require('moment');
const bcrypt = require('bcryptjs');
const cheerio = require('cheerio');

const utils = module.exports = {

  /**
   * 模版中转化日期格式
   */
  toDate(time, type) {
    if (type === 1 || !type) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    } else if (type === 2) {
      return moment(time).format('YYYY-MM-DD');
    }
  },

  /**
   * 加密密码
   */
  bhash(str) {
    return bcrypt.hashSync(str, 10);
  },

  /**
   * 比较密码和密文
   */
  bcompare(str, hash) {
    return bcrypt.compareSync(str, hash);
  },

  /**
   * 随机数字
   */
  randNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
  },

  /**
   * http转化为https
   */
  toHttps(url) {
    return url.replace("http://", "https://");
  },

  /**
   * 数组混合并去重
   */
  mixinArray(...argv) {
    let arr = []
    argv.forEach((array)=>{
      arr = arr.concat(array);
    });
    return [...new Set(arr)];
  },

  /**
   * 截取字符串 中英文混合
   * @param str	待处理字符串
   * @param len	截取字节长度 中文2字节 英文1字节
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
   * 获取分页参数
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
  }
};
