module.exports = function(app) {
  [ 
    'defalut',
    'article',
    'author', 
    'category',
    'page',
    'search',
    'tags',
    'text'
  ].map(m => require(`./${m}.js`)(app));
};
