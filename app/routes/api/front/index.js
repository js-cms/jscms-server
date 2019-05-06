module.exports = function (app) {
  [
    'article',
    'captcha',
    'user'
  ].map(m => require(`./${m}.js`)(app));
};
