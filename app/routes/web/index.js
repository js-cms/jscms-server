module.exports = function(app) {
  [ 
    'default',
    'article',
    'author',
    'categories',
    'category',
    'latest',
    'search',
    'tags',
    'text',
    'page'
  ].map(m => require(`./${m}.js`)(app));
};
