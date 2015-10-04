import Habitica from '../../src/index';
import Connection from '../../src/connection';

describe('Habitica Api', () => {

  describe('attributes', () => {
    let api = new Habitica({uuid: 'foo', token: 'bar' });
    let attributes = [
      'account',
      'content',
    ];

    attributes.forEach((param) => {
      it(`has a ${param} attribute`, () => {
        expect(api[param]).to.exist;
      });
    });
  });
});
