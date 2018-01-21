module.exports = {
  parse,
};

/**
 * Returns a route path from our custom format
 *
 * @param {String} route
 * @param {Array<Array>} routeStringMapping
 * @return {String}
 */
function parse(
  route,
  routeStringMapping
) {
  return routeStringMapping.reduce((route, mapping) =>
    route.replace(mapping.from, mapping.to), route);
};
