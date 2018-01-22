const express = require('express');

const handlerFactory = require('./lib/handler-factory');
const {findRoutesAndSources} = require('./lib/explorer');
const {prioritise} = require('./lib/prioritiser');

const DEFAULT_ALLOWED_FILENAMES = new RegExp(/([\{\}0-9a-zA-Z\-\_]*?)\.js$/i);
const DEFAULT_ALLOWED_METHODS = new RegExp(/(get|post|put|delete|patch|head|options)/i); // eslint-disable-line max-len
const DEFAULT_OPTION_SILENT = false;
const DEFAULT_OPTION_LOGGER = console;
const DEFAULT_ROUTE_STRING_MAP = [
  ['star', '*'],
  ['index', ''],
  ['_', ':'],
];

module.exports = expressDiroutes;

/**
 * Returns an Express router depending on the directory structure.
 *
 * @param {Object} args
 * @param {String} args.rootPath
 * @param {String} args.routePath
 * @param {RegExp} args.allowedFileNames
 * @param {RegExp} args.allowedMethods
 * @param {Object} args.options
 * @param {Boolean} args.options.silent : when set to true, no logs are shown
 * @param {Object} args.options.logger : defines the logger to use
 *
 * @return {Function} express.Router()
 */
function expressDiroutes({
  rootPath = process.cwd(),
  routePath = '/',
  allowedFileNames = DEFAULT_ALLOWED_FILENAMES,
  allowedMethods = DEFAULT_ALLOWED_METHODS,
  silent = DEFAULT_OPTION_SILENT,
  logger = DEFAULT_OPTION_LOGGER,
  routeStringMap = DEFAULT_ROUTE_STRING_MAP,
}) {
  const routeStringMapping = routeStringMap.map((replacement) => ({
      from: new RegExp(`{${replacement[0]}}`, 'gi'),
      to: replacement[1],
  }));
  const options = {
    allowedMethods,
    silent,
    logger,
    routeStringMap,
    routeStringMapping,
  };
  const _router = new express.Router();
  const routeHandlers = findRoutesAndSources(
    {allowedFileNames, rootPath, routePath, options}
  )
    .map(prioritise)
    .sort((a, b) =>
      (a.priority > b.priority) ? -1 : (a.priority < b.priority) ? 1 : 0
    );

  const router = routeHandlers.reduce((existingRouter, currentRouteHandler) =>
    handlerFactory.addRoute({
      router: existingRouter,
      routeHandler: currentRouteHandler,
      options,
    }),
    _router
  );

  return router;
};
