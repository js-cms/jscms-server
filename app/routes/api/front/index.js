module.exports = function (app) {
  [
    'article',
    'captcha',
    'comment',
    'user'
  ].map(m => require(`./${m}.js`)(app));
};
