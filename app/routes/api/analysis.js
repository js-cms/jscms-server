/** 统计分析api */
module.exports = function(app) {
  const { router, controller } = app;
  router.get('/api/analysis/ip', controller.api.analysis.ip); //统计独立ip
  router.get('/api/analysis/pv', controller.api.analysis.pv); //统计pv浏览量
}
