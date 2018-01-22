const fs = require('fs');
const path = require('path');

const explorer = require('../../lib/explorer');

describe('explorer', () => {
  const allowedFileNames = new RegExp(/([\{\}0-9a-zA-Z\-\_]*?)\.js$/i);
  const testDirectoryPath =
    path.join(__dirname, '../data/separate_directories_and_files');
  const routeStringMapping = [
      ['maptest', 'expected'],
    ].map((replacement) => ({
      from: new RegExp(`{${replacement[0]}}`, 'gi'),
      to: replacement[1],
  }));

  describe('.findRoutesAndSources()', () => {
    it('works as expected', () => {
      const observed = explorer.findRoutesAndSources({
        rootPath: testDirectoryPath,
        routePath: '/test',
        allowedFileNames,
        options: {
          routeStringMapping,
        },
      });
      expect(observed).to.have.length(4);
      observed.forEach((observedItem) => {
        expect(observedItem).to.include.key('route');
        expect(observedItem).to.include.key('source');
      });
      expect(observed[0].route).to.eql('/test/file_a');
      expect(observed[1].route).to.eql('/test/file_b');
      expect(observed[2].route).to.eql('/test/dir_a/file_1');
      expect(observed[3].route).to.eql('/test/dir_a/expected');
    });
  });

  describe('.separateDirectoriesAndFiles()', () => {
    it('separates directories and files correctly', () => {
      const observed = explorer.separateDirectoriesAndFiles({
        allowedFileNames,
        directoryListing: fs.readdirSync(testDirectoryPath),
        rootPath: testDirectoryPath,
        routePath: '/',
        options: {
          routeStringMapping: [],
        },
      });

      expect(observed).to.have.keys(['directories', 'files']);
      expect(observed.directories).to.eql([
        'dir_a',
        'dir_b',
        'dir_c',
      ]);
      expect(observed.files).to.have.length(2);
      expect(observed.files[0].route).to.eql('/file_a');
      expect(observed.files[1].route).to.eql('/file_b');
    });

    it('maps filenames to routes correctly', () => {
      const mapTestDirectoryPath =
        path.join(testDirectoryPath, './dir_a');
      const observed = explorer.separateDirectoriesAndFiles({
        allowedFileNames,
        directoryListing: fs.readdirSync(mapTestDirectoryPath),
        rootPath: mapTestDirectoryPath,
        routePath: '/',
        options: {
          routeStringMapping,
        },
      });
      expect(observed.files).to.have.length(2);
      expect(observed.files[0].route).to.eql('/file_1');
      expect(observed.files[1].route).to.eql('/expected');
    });
  });
});
