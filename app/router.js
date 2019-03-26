'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  //web端路由
  require('./routes/web/index.js')(app);
  //api路由
  require('./routes/api/index.js')(app);
};
