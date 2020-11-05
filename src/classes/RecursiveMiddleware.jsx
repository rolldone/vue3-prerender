const defineRecursiveMiddleware = function(index, the_to, the_from, next, middlewares) {
  return new Promise(async function(resolve) {
    if (middlewares[index] == null) {
      return resolve(null);
    }
    let nextMiddlewareItem = await defineRecursiveMiddleware(index + 1, the_to, the_from, next, middlewares);
    if (nextMiddlewareItem == null) {
      nextMiddlewareItem = next;
      if (next == null) {
        nextMiddlewareItem = () => {};
      }
    }
    return resolve(middlewares[index].bind(null, the_to, the_from, next, nextMiddlewareItem));
  });
};

export default defineRecursiveMiddleware;
