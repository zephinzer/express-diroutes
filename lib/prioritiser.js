const DIGIT_SPACE = 3;
const DIGIT_BASE = 10;
const POWER_DECIMAL = Math.pow(DIGIT_BASE, DIGIT_SPACE);

module.exports = {
  prioritise,
  priorityGenerator,
};

/**
 * Assigns a :priority property to :routeHandler based on the :route property.
 * General algorithm outline:
 * - get number of sections of the route -> a
 * - start with 0, for each non-wildcard section, increment -> b
 * - start with 0, for each wildcard, add the position of the wildcard -> c
 * - start with 0, for each query parameter, increment -> d
 * - prioritise meta data order as: a > b > c > d using multiples of 100
 *
 * @param {Object} routeHandler
 * @param {String} routeHandler.route
 *
 * @return {Object} routeHandler
 */
function prioritise(routeHandler) {
  const routeSections = routeHandler.route.split('/');
  const score = {
    sections: routeSections.reduce((prev, curr) =>
      prev && curr.length == 0, true) ?
        routeSections.length - 1 : routeSections.length,
    wildcard: routeSections.reduce((prev, curr, index) =>
      (curr.indexOf('*') === -1) ? prev + (POWER_DECIMAL - index) : prev, 0),
    wildcardPosition: routeSections.reduce((prev, curr, index) =>
      (curr.indexOf('*') !== -1) ? prev + (curr.indexOf('*') + 1) : prev, 0),
    queryParam: routeSections.reduce((prev, curr, index) =>
      (curr.indexOf(':') === -1) ? prev + (POWER_DECIMAL - index): prev, 0),
    length: POWER_DECIMAL - routeHandler.route.length,
  };
  const scoreComponents = Object.keys(score);
  const scorePower = scoreComponents.length * DIGIT_SPACE;
  let priority = priorityGenerator(Math.pow(DIGIT_BASE, scorePower));
  routeHandler.priority =
    + score.sections * (priority.next().value)
    + score.wildcard * (priority.next().value)
    + score.wildcardPosition * (priority.next().value)
    + score.queryParam * (priority.next().value)
    + score.length * (priority.next().value)
  ;
  routeHandler.score = score;
  return routeHandler;
};

/**
 * Continuously returns i / 1000
 *
 * @param {Number} i
 */
function* priorityGenerator(i) {
  while (i > 0) {
    yield i /= Math.pow(10, DIGIT_SPACE);
  }
};

