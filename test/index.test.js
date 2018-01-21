const expressDiroutes = require('../index');
const path = require('path');

describe('express-diroutes', () => {
  describe('()', () => {
    it('works as expected', () => {
      expect(expressDiroutes).to.be.a('function');
    });
  });

  describe('priority setting', () => {
    it('works as expected with sections', () => {
      const router = expressDiroutes({
        rootPath: path.join(__dirname, './data/section_order'),
        silent: true,
      });
      const expectedRouteOrder = [
        '/abc/a/a',
        '/abc/a/abc',
        '/a/a',
        '/a/b',
        '/a/ab',
        '/abc/a',
        '/a/abc',
        '/abc/ab',
        '/abc/abc',
        '/b',
        '/a',
        '/ab',
        '/abc',
      ];

      let i = 0;
      router.stack.map((a) => {
        a.handle(null, {
          json: (arg) => {
            expect(arg).to.eql(expectedRouteOrder[i++]);
          },
        });
      });
    });

    it('works as expected with string lengths', () => {
      const router = expressDiroutes({
        rootPath: path.join(__dirname, './data/length_order'),
        silent: true,
      });
      const expectedRouteOrder = [
        '/a',
        '/abcdefg',
        '/abcdefghijk',
      ];

      let i = 0;
      router.stack.map((a) => {
        a.handle(null, {
          json: (arg) => {
            expect(arg).to.eql(expectedRouteOrder[i++]);
          },
        });
      });
    });

    it('works as expected with \'*\'s', () => {
      const router = expressDiroutes({
        rootPath: path.join(__dirname, './data/star_order'),
        silent: true,
      });
      const expectedRouteOrder = [
        '/a/*',
        '/*/a',
        '/*/*',
        '/a',
        '/ab',
        '/a*',
        '/*',
        '/',
      ];

      let i = 0;
      router.stack.map((a) => {
        a.handle(null, {
          json: (arg) => {
            expect(arg).to.eql(expectedRouteOrder[i++]);
          },
        });
      });
    });

    it('works as expected with \'x*\'s and \'*x\'s ', () => {
      const router = expressDiroutes({
        rootPath: path.join(__dirname, './data/star_position_order'),
        silent: true,
      });
      const expectedRouteOrder = [
        '/a*/a',
        '/a*/a*',
        '/a*/*a',
        '/a',
        '/a*',
        '/*a',
      ];

      let i = 0;
      router.stack.map((a) => {
        a.handle(null, {
          json: (arg) => {
            expect(arg).to.eql(expectedRouteOrder[i++]);
          },
        });
      });
    });

    it('works as expected with \':id\'s', () => {
      const router = expressDiroutes({
        rootPath: path.join(__dirname, './data/param_order'),
        silent: true,
      });
      const expectedRouteOrder = [
        '/a/:id',
        '/:id/a',
        '/:id/:id',
        '/a',
        '/ab',
        '/:id',
        '/',
      ];

      let i = 0;
      router.stack.map((a) => {
        a.handle(null, {
          json: (arg) => {
            expect(arg).to.eql(expectedRouteOrder[i++]);
          },
        });
      });
    });
  });
});
