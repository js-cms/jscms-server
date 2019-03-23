'use strict';

const dbType = 'mongodb';
const dbUser = '';
const dbPass = '';
const dbHost = '127.0.0.1';
const dbPort = '27017';
const dbName = 'jscms';
const parameter = 'authSource=admin';

module.exports = {
  client: {
    url: `${dbType}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?${parameter}`,
    options: {
      poolSize: 200,
      useNewUrlParser: true
    }
  }
}
