/** 统计分析api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/back/analysis/ip', controller.api.back.analysis.ip); //统计独立ip
  router.get('/api/back/analysis/pv', controller.api.back.analysis.pv); //统计pv浏览量
  router.get('/api/back/analysis/search', controller.api.back.analysis.search); //统计搜索量
}
