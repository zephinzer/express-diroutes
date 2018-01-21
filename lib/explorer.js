const fs = require('fs');
const path = require('path');

const parser = require('./parser');

module.exports = {
  findRoutesAndSources,
};

/**
 * Returns an array of objects of the form:
 *  {
 *    route : String,
 *    source : String
 *  }
 * by recursively descending through :rootPath
 *
 * @param {String} rootPath from which to start parsing
 * @param {String} routePath of the algorithm
 * @return {Array<Object>}
 */
function findRoutesAndSources({
  rootPath,
  routePath,
  allowedFileNames,
  options,
}) {
  const directoryListing = fs.readdirSync(rootPath);
  const separatedListing = separateDirectoriesAndFiles({
    allowedFileNames,
    directoryListing,
    options,
    rootPath,
    routePath,
  });
  let routes = (separatedListing.files.length > 0) ?
    separatedListing.files : [];

  separatedListing.directories.forEach((directoryName) => {
    routes = routes.concat(findRoutesAndSources({
      rootPath: path.join(rootPath, directoryName),
      routePath: path.join(routePath, directoryName),
      allowedFileNames,
      options,
    }));
  });
  return routes;
};

/**
 * @param {Array} directoryListing
 *
 * @return {Object}
 */
function separateDirectoriesAndFiles({
  allowedFileNames,
  directoryListing,
  options,
  rootPath,
  routePath,
}) {
  return directoryListing.reduce((prev, currentItem, index) => {
    const routeName = currentItem.match(allowedFileNames);
    const routeSourcePath = path.join(rootPath, currentItem);
    const routeSource = fs.lstatSync(routeSourcePath);

    let directories = prev.directories;
    let files = prev.files;

    if (routeSource.isDirectory()) {
      directories = directories.concat(currentItem);
    } else if (routeName !== null) {
      files = files.concat({
        route: parser.parse(
          path.join(routePath, routeName[1]),
          options.routeStringMapping
        ),
        source: path.join(rootPath, currentItem),
      });
    }
    return Object.assign({}, prev, {directories, files});
  }, {directories: [], files: []});
};
