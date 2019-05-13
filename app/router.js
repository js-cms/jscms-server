'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // 前台web端路由
  require('./routes/web/index.js')(app);
  // 后台api路由
  require('./routes/api/back/index.js')(app);
  // 前台api路由
  require('./routes/api/front/index.js')(app);
};
