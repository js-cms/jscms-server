'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};
  config.mongoose = require('./db.js');
  config.directory = require('./directory.js');
  config.theme = require('./theme.js');

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532073849273_2285';

  config.password = "bba76d0c6606b500";

  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
    root: [
      path.join(appInfo.baseDir, config.directory.JSCMS_THEME)
    ].join(',')
  };

  // add your config here
  config.middleware = [
    'common',
    'authUser',
    'errorHandler'
  ];

  //关闭csrf
  config.security = {
    csrf: {
      ignore: '/api/*',
    },
    domainWhiteList: [
      'http://localhost:8081',
      'http://localhost:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:8080'
    ]
  };

  config.static = {
    dir: [
      {
        prefix: config.directory.JSCMS_URL_STATIC,
        dir: path.join(appInfo.baseDir, config.directory.JSCMS_STATIC)
      },
      {
        prefix: config.directory.JSCMS_URL_MANAGEMENT,
        dir: path.join(appInfo.baseDir, config.directory.JSCMS_MANAGEMENT)
      },
      {
        prefix: config.directory.JSCMS_URL_THEME_STATIC,
        dir: path.join(appInfo.baseDir, config.directory.JSCMS_THEME)
      }
    ]
  }

  //404 page
  // config.notfound = {
  //     pageUrl: '/view/404.html',
  // };

  return config;

};
