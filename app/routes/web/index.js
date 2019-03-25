module.exports = [
  'author', 
  'defalut',
  'main',
  'page',
  'search',
  'tags',
  'txt'
].map(m => require(`./${m}`));
