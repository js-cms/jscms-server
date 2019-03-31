/** 增删改查通用api */
module.exports = function(app) {
  const { router, controller } = app;
  const authStrict = app.middleware.authStrict();
  router.get('/api/crud/:model/list', authStrict, controller.api.crud.list); //查询符合条件的多条数据
  router.get('/api/crud/:model/one', authStrict, controller.api.crud.one); //查询符合条件的单条数据
  router.post('/api/crud/:model/create', authStrict, controller.api.crud.create); //创建一条或多条数据
  router.post('/api/crud/:model/delete', authStrict, controller.api.crud.delete); //删除符合条件的一条或多条数据
  router.post('/api/crud/:model/update', authStrict, controller.api.crud.update); //更新符合条件的一条或多条数据
}
