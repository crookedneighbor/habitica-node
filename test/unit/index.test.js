import Habitica from '../../src/index';

describe('Habitica Api', () => {

  describe('initialization', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore(); // eslint-disable-line no-console
    });

    it('warns if user id and api are not provided', () => {
      let api = new Habitica();

      expect(console.warn).to.be.calledOnce; // eslint-disable-line no-console
      expect(console.warn).to.be.calledWith('Missing credentials; Only content routes will be available'); // eslint-disable-line no-console
    });
  });

  describe('attributes', () => {
    let api = new Habitica({uuid: 'foo', token: 'bar' });
    let attributes = [
      'content',
    ];

    attributes.forEach((param) => {
      it(`has a ${param} attribute`, () => {
        expect(api[param]).to.exist;
      });
    });
  });
});
