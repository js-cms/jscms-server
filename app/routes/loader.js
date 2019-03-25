module.exports = function(modules, router, controller) {
  modules.forEach(m => {
    let routerObject = m(controller);
    for (const key in routerObject) {
      if (routerObject.hasOwnProperty(key)) {
        const p = routerObject[key];
        router[key](...p);
      }
    }
  });
}
