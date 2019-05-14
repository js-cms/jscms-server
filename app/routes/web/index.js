module.exports = function(app) {
  [ 
    'article',
    'author',
    'categories',
    'category',
    'default',
    'latest',
    'page',
    'search',
    'tags',
    'text'
  ].map(m => require(`./${m}.js`)(app));
};
