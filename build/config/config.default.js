'use strict';

const path = require('path');

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1532073849273_2285';

    config.password = "bba76d0c6606b500";

    config.view = {
        defaultViewEngine: 'ejs',
        mapping: {
            '.html': 'ejs',
        },
    };

    config.mongoose = require('./db.js');

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
            'http://127.0.0.1:8081',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
            'http://admin.meicili.com'
        ]
    };
    
    //404 page
    // config.notfound = {
    //     pageUrl: '/view/404.html',
    // };

    return config;
};