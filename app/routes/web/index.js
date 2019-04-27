module.exports = function(app) {
  [ 
    'defalut',
    'article',
    'author', 
    'category',
    'search',
    'tags',
    'text',
    'page'
  ].map(m => require(`./${m}.js`)(app));
};
