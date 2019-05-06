/**
 * context 框架扩展
 */

const _ = require('lodash');

module.exports = {

  /**
   * 校验登陆用户的权限
   * @param {Array|String} powers 权限值
   */
  hasPowers(powers, targetUser) {
    let _powers = [];
    let user = targetUser || this.locals.currentUser.user;
    if (!user.powers || user.powers.length === 0) return false;
    if (typeof powers !== 'object') {
      _powers = [String(powers)];
    } else {
      _powers = _.cloneDeep(powers);
    }
    if (user.powers[0] === 'super') return true;
    let res = [];
    _powers.forEach(p => {
      if (user.powers.includes(p)) res.push(true);
    });
    return res.length === user.powers.length;
  }
};
