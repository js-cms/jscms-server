'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};
  config.mongoose = require('./db.js');
  config.constant = require('./constant/index.js');
  config.theme = require('./theme.js');

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532073849273_2285';

  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
    root: [
      path.join(appInfo.baseDir, config.constant.directory.JSCMS_THEME)
    ].join(',')
  };

  // add your config here
  config.middleware = [
    'authUser',
    'errorHandler'
  ];

  //关闭csrf
  config.security = {
    csrf: {
      ignore: '/api/*',
    },
    domainWhiteList: [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:9012',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:9012'
    ]
  };
  
  config.static = {
    dir: [
      {
        prefix: config.constant.directory.JSCMS_URL_MANAGEMENT,
        dir: path.join(appInfo.baseDir, config.constant.directory.JSCMS_MANAGEMENT)
      },
      {
        prefix: config.constant.directory.JSCMS_URL_STATIC,
        dir: path.join(appInfo.baseDir, config.constant.directory.JSCMS_STATIC)
      },
      {
        prefix: config.constant.directory.JSCMS_URL_THEME_STATIC,
        dir: path.join(appInfo.baseDir, config.constant.directory.JSCMS_THEME)
      }
    ]
  }

  config.multipart = {
    mode: 'file',
  };

  return config;
};
