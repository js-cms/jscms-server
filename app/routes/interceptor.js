const FileLoader = require('egg-core/lib/loader/file_loader');
const path = require('path');

module.exports = function(router, app) {
  const services = {};
  const dirBase = path.join(__dirname, '../controller');
  new FileLoader({
    directory: dirBase,
    target: services,
  }).load();
  console.log(services.article.ArticleController);
}