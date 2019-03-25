module.exports = function(router, controller) {
  let object = controller.test.index.prototype.constructor;
  console.log(controller.test.index.prototype.constructor);
  console.log(Object.getOwnPropertyNames(object));
}