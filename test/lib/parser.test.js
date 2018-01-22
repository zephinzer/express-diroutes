const parser = require('../../lib/parser');

describe('lib/parser', () => {
  const routeStringMapping = [
      ['maptest', 'expected'],
    ].map((replacement) => ({
      from: new RegExp(`{${replacement[0]}}`, 'gi'),
      to: replacement[1],
  }));

  it('exports the correct keys', () => {
    expect(parser).to.have.keys([
      'parse',
    ]);
    expect(parser.parse).to.be.a('function');
  });

  it('works as expected', () => {
    expect(parser.parse('/{maptest}', routeStringMapping)).to.eql('/expected');
  });
});
