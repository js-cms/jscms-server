module.exports = function (app) {
  [
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
