const handlerHome = require('./home');
const handlerCategory = require('./category');
const handlerAuthor = require('./author');
const handlerTags = require('./tags');
const handlerSearch = require('./search');
const handlerArticle = require('./article');
const handlerPage = require('./page');
const handlerNotFound = require('./notfound');

module.exports = {
  home: handlerHome,
  category: handlerCategory,
  author: handlerAuthor,
  tags: handlerTags,
  search: handlerSearch,
  article: handlerArticle,
  page: handlerPage,
  notFound: handlerNotFound
};
