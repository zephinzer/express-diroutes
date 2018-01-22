const prioritiser = require('../../lib/prioritiser');

describe('lib/prioritiser', () => {
  it('exports the correct keys', () => {
    expect(prioritiser).to.have.keys([
      'prioritise',
      'priorityGenerator',
    ]);
    expect(prioritiser.prioritise).to.be.a('function');
    expect(prioritiser.priorityGenerator).to.be.a('function');
  });

  describe('.prioritise()', () => {
    it('returns the correct schema', () => {
      const observed = prioritiser.prioritise({
        route: '/_test_route',
      });

      expect(observed).to.have.keys([
        'route',
        'priority',
        'score',
      ]);
      expect(observed.score).to.have.keys([
        'sections',
        'wildcard',
        'wildcardPosition',
        'queryParam',
        'length',
      ]);
    });

    it('scores sections correctly', () => {
      const observed = prioritiser.prioritise({
        route: '/a/b/c',
      });

      expect(observed.route).to.eql('/a/b/c');
      expect(observed.score.sections).to.eql(4);
      expect(observed.score.wildcard).to.eql(3994);
      expect(observed.score.wildcardPosition).to.eql(0);
      expect(observed.score.queryParam).to.eql(3994);
      expect(observed.score.length).to.eql(994);
    });

    describe('wildcard and position scoring', () => {
      let testCaseA = null;
      let testCaseB = null;
      let testCaseC = null;
      let testCaseD = null;
      let testCaseE = null;
      let testCaseF = null;
      let testCaseG = null;
      let testCaseH = null;

      before(() => {
        testCaseA = prioritiser.prioritise({route: '/a/b/c'});
        testCaseB = prioritiser.prioritise({route: '/a/b/*'});
        testCaseC = prioritiser.prioritise({route: '/a/*/c'});
        testCaseD = prioritiser.prioritise({route: '/*/b/c'});
        testCaseE = prioritiser.prioritise({route: '/a/*/*'});
        testCaseF = prioritiser.prioritise({route: '/*/b/*'});
        testCaseG = prioritiser.prioritise({route: '/*/*/c'});
        testCaseH = prioritiser.prioritise({route: '/*/*/*'});
      });

      it('works as expected', () => {
        expect(testCaseA.priority).to.be.above(testCaseB.priority);
        expect(testCaseB.priority).to.be.above(testCaseC.priority);
        expect(testCaseC.priority).to.be.above(testCaseD.priority);
        expect(testCaseD.priority).to.be.above(testCaseE.priority);
        expect(testCaseE.priority).to.be.above(testCaseF.priority);
        expect(testCaseF.priority).to.be.above(testCaseG.priority);
        expect(testCaseG.priority).to.be.above(testCaseH.priority);
      });
    });

    it('scores query parameters correctly', () => {
      let testCaseA = null;
      let testCaseB = null;
      let testCaseC = null;
      let testCaseD = null;
      let testCaseE = null;
      let testCaseF = null;
      let testCaseG = null;
      let testCaseH = null;

      before(() => {
        testCaseA = prioritiser.prioritise({route: '/a/b/c'});
        testCaseB = prioritiser.prioritise({route: '/a/b/:c'});
        testCaseC = prioritiser.prioritise({route: '/a/:b/c'});
        testCaseD = prioritiser.prioritise({route: '/:a/b/c'});
        testCaseE = prioritiser.prioritise({route: '/a/:b/:c'});
        testCaseF = prioritiser.prioritise({route: '/:a/b/:c'});
        testCaseG = prioritiser.prioritise({route: '/:a/:b/c'});
        testCaseH = prioritiser.prioritise({route: '/:a/:b/:c'});
      });

      it('works as expected', () => {
        expect(testCaseA.priority).to.be.above(testCaseB.priority);
        expect(testCaseB.priority).to.be.above(testCaseC.priority);
        expect(testCaseC.priority).to.be.above(testCaseD.priority);
        expect(testCaseD.priority).to.be.above(testCaseE.priority);
        expect(testCaseE.priority).to.be.above(testCaseF.priority);
        expect(testCaseF.priority).to.be.above(testCaseG.priority);
        expect(testCaseG.priority).to.be.above(testCaseH.priority);
      });
    });

    describe('section length scoring', () => {
      let testCaseA = null;
      let testCaseB = null;
      let testCaseC = null;
      let testCaseD = null;

      before(() => {
        testCaseA = prioritiser.prioritise({route: '/a/b/c/d'});
        testCaseB = prioritiser.prioritise({route: '/a/b/c/de'});
        testCaseC = prioritiser.prioritise({route: '/a/b/c/defg'});
        testCaseD = prioritiser.prioritise({route: '/a/b/c/defgh'});
      });

      it('works as expected', () => {
        expect(testCaseA.priority).to.be.above(testCaseB.priority);
        expect(testCaseB.priority).to.be.above(testCaseC.priority);
        expect(testCaseC.priority).to.be.above(testCaseD.priority);
      });
    });
  });
});
