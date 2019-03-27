/** 搜索记录api */
module.exports = function(app) {
  const { router, controller } = app; 
  router.post('/api/log/delete', controller.api.log.delete); //删除搜索记录
  router.get('/api/log/list', controller.api.log.list); //获取搜索记录列表
}
