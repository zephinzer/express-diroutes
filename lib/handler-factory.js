const parser = require('./parser');

module.exports = {
  addRoute,
};

/**
 * Registers a route on the provided :router
 *
 * @param {Object} args
 * @param {Function} args.router : express.Router()
 * @param {Object} args.routeHandler
 * @param {String} args.routeHandler.route : route to be registered
 * @param {String} args.routeHandler.source : full path to the source file
 * @param {Object} args.options
 * @param {Boolean} args.options.silent : when toggled
 * @param {Object} args.options.routeStringMapping
 * @param {RegExp|String} args.options.routeStringMapping.from
 * @param {String} args.options.routeStringMapping.to
 * @param {Object} args.options.logger
 *
 * @return {Object} express.Router()
 */
function addRoute({
  router,
  routeHandler,
  options = {
    silent: false,
    logger: {
      info: () => {},
      warn: () => {},
    },
    allowedMethods,
    routeStringMapping,
  },
}) {
  let {route, source, priority} = routeHandler;
  const parsedRoute = parser.parse(
    route,
    options.routeStringMapping
  );
  const {logger, allowedMethods} = options;
  try {
    const routeController = require(source)();
    switch (typeof routeController) {
      case 'function':
        router.use(parsedRoute, routeController);
        if (!options.silent) {
          logger.info(`[*] @ ${parsedRoute} registered successfully [priority: ${priority}].`); // eslint-disable-line max-len
        }
        break;
      case 'object':
        Object.keys(routeController)
          .forEach((method) => {
            if (method.match(allowedMethods) !== null) {
              router[method](
                parsedRoute,
                routeController[method]
              );
              logger.info(`[${method.toUpperCase()}] @ ${parsedRoute} registered successfully [priority: ${priority}].`); // eslint-disable-line max-len
            } else {
              logger.warn(`[${method.toUpperCase()}] @ ${parsedRoute} failed to register [priority: ${priority}]: method name is not a valid HTTP method.`); // eslint-disable-line max-len
            }
          });
        break;
      default:
        logger.info('    [!] specified ');
    };
  } catch (ex) {
    logger.warn(`[*] @ ${parsedRoute} failed to register [priority: ${priority}]: ${ex.message}`); // eslint-disable-line max-len
  }
  return router;
};
