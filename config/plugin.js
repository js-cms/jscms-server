'use strict';

// had enabled by egg
// exports.static = true;
exports.ejs = {
    enable: true,
    package: 'egg-view-ejs',
};

exports.validate = {
    enable: true,
    package: 'egg-validate',
};

// exports.redis = {
//     enable: true,
//     package: 'egg-redis',
// };

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.cors = {
    enable: true,
    package: 'egg-cors',
};