/** 统计分析api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  router.get('/api/back/analysis/ip', powerAdmin, controller.api.back.analysis.ip); //统计独立ip
  router.get('/api/back/analysis/pv', powerAdmin, controller.api.back.analysis.pv); //统计pv浏览量
  router.get('/api/back/analysis/search', powerAdmin, controller.api.back.analysis.search); //统计搜索量
}
