module.exports = function(app) {
  [
    'author', 
    'defalut',
    'main',
    'page',
    'search',
    'tags',
    'text'
  ].map(m => require(`./${m}.js`)(app));
};
