module.exports = function(app) {
  [
    'author', 
    'defalut',
    'main',
    'page',
    'search',
    'tags',
    'txt'
  ].map(m => require(`./${m}.js`)(app));
};
