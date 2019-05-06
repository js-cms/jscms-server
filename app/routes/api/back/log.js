/** 搜索记录api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/back/log/delete', controller.api.back.log.delete); //删除搜索记录
  router.get('/api/back/log/list', controller.api.back.log.list); //获取搜索记录列表
}
