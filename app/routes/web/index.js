module.exports = function(app) {
  [ 
    'article',
    'author', 
    'category',
    'defalut',
    'page',
    'search',
    'tags',
    'text'
  ].map(m => require(`./${m}.js`)(app));
};
