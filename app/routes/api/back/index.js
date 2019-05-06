module.exports = function (app) {
  [
    'analysis',
    'article',
    'captcha',
    'category',
    'comment',
    'config',
    'log',
    'model',
    'page',
    'resource',
    'user',
    'crud'
  ].map(m => require(`./${m}.js`)(app));
};
