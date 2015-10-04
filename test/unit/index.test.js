import Habitica from '../../src/index';

describe('Habitica Api', () => {
  let api = new Habitica({uuid: 'myUuid', token: 'myToken' });

  describe('#getUuid', () => {
    it('returns uuid', () => {
      expect(api.getUuid()).to.eql('myUuid');
    });
  });

  describe('#getToken', () => {
    it('returns token', () => {
      expect(api.getToken()).to.eql('myToken');
    });
  });

  describe('#getEndpoint', () => {
    it('returns token', () => {
      expect(api.getEndpoint()).to.eql('https://habitica.com/api/v2');
    });
  });

  describe('#setCredentials', () => {
    it('sets new credentials', () => {
      api.setCredentials({uuid: 'newUuid', token: 'newToken'});

      expect(api.getUuid()).to.eql('newUuid');
      expect(api.getToken()).to.eql('newToken');
    });
  });

  describe('attributes', () => {
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
