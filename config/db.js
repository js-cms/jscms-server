'use strict';
module.exports = {
  client: {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/cilihome',
    options: {
      poolSize: 20,
      useNewUrlParser: true
    }
  }
}
