module.exports = function (app) {
  [
    'article',
    'captcha',
    'comment',
    'mail',
    'user'
  ].map(m => require(`./${m}.js`)(app));
};
