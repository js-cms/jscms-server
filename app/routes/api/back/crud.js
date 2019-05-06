/** 增删改查通用api */
module.exports = function(app) {
  const { router, controller } = app;
  const powerSuper = app.middleware.userRequiredPowers({powers: ['super']});
  const powerAdmin = app.middleware.userRequiredPowers({powers: ['admin']});
  router.get('/api/back/crud/:model/list', powerAdmin, controller.api.back.crud.list); //查询符合条件的多条数据
  router.get('/api/back/crud/:model/one', powerAdmin, controller.api.back.crud.one); //查询符合条件的单条数据
  router.post('/api/back/crud/:model/create', powerAdmin, controller.api.back.crud.create); //创建一条或多条数据
  router.post('/api/back/crud/:model/delete', powerSuper, controller.api.back.crud.delete); //删除符合条件的一条或多条数据
  router.post('/api/back/crud/:model/update', powerSuper, controller.api.back.crud.update); //更新符合条件的一条或多条数据
}
