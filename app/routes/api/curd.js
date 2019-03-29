/** 增删改查通用api */
module.exports = function(app) {
  const { router, controller } = app;
  router.post('/api/curd', controller.api.curd.index); //公共接口
  router.post('/api/curd/create', controller.api.curd.create); //创建
  router.post('/api/curd/update', controller.api.curd.update); //更新
  router.post('/api/curd/delete', controller.api.curd.delete); //删除
  router.post('/api/curd/retrieve', controller.api.curd.retrieve); //读取
}
