module.exports = function (app) {
  [
    'analysis',
    'article',
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
