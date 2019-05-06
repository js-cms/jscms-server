'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // web端路由
  require('./routes/web/index.js')(app);
  // 后台管理api路由
  require('./routes/api/back/index.js')(app);
  // 前台用户api路由
  require('./routes/api/front/index.js')(app);
};
