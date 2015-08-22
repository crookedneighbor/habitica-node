import Connection from '../src/connection';

describe('Connection', () => {
  let habiticaUrl;
  const defaultOptions = {
    uuid: 'myUuid',
    token: 'myToken'
  };

  describe('initialization', () => {
    it('defaults to habitica endpoint', () => {
      let connection = new Connection(defaultOptions);
      expect(connection._endpoint).to.eql('https://habitica.com/api/v2');
    });

    it('accepts an override for endpoint', () => {
      let connection = new Connection({
        uuid: 'myUuid',
        token: 'myToken',
        endpoint: 'https://someotherendpoint'
      });

      expect(connection._endpoint).to.eql('https://someotherendpoint');
    });
  });

  describe('#get', () => {
    beforeEach(() => {
      habiticaUrl = nock('https://habitica.com/api/v2')
        .get('/user')
    });

    it('returns a promise', () => {
      let connection = new Connection(defaultOptions);
      let request = connection.get('user');

      expect(request).to.respondTo('then');
    });

    it('takes in an optional query parameter', () => {
      let expectedRequest = nock('https://habitica.com/api/v2')
        .get('/group')
        .query({type: 'party'})
        .reply(200)

      let connection = new Connection(defaultOptions);
      let request = connection.get('group', {type: 'party'});

      expectedRequest.done();
    });

    context('succesful request', () => {

      it('returns requested data', () => {
        let expectedRequest = habiticaUrl.reply(() => {
          return [200, { some: 'data' }];
        });

        let connection = new Connection(defaultOptions);
        let request = connection.get('user');

        expectedRequest.done();
        return expect(request).to.eventually.eql({ some: 'data' });
      });
    });

    context('unsuccesful request', () => {

      it('rejects if credentials are not valid', () => {
        let expectedRequest = habiticaUrl.reply(function () {
          return [401, 'Not allowed'];
        });

        let connection = new Connection(defaultOptions);
        let request = connection.get('user');

        expectedRequest.done();
        return expect(request).to.be.rejectedWith('Error: Unauthorized');
      });
    });
  });

  describe('#post', () => {
    beforeEach(() => {
      habiticaUrl = nock('https://habitica.com/api/v2')
        .post('/user/tasks')
    });

    it('returns a promise', () => {
      let connection = new Connection(defaultOptions);
      let request = connection.post('user/tasks');

      expect(request).to.respondTo('then');
    });

    it('takes in an optional query parameter', () => {
      let expectedRequest = nock('https://habitica.com/api/v2')
        .post('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {});

      let connection = new Connection(defaultOptions);
      let request = connection.post('user/tasks', {
          type: 'habit',
          text: 'test habit'
        });

      expectedRequest.done();
    });

    context('succesful request', () => {

      it('returns requested data', () => {
        let expectedRequest = habiticaUrl.reply(() => {
          return [200, { some: 'data' }];
        });

        let connection = new Connection(defaultOptions);
        let request = connection.post('user/tasks');

        expectedRequest.done();
        return expect(request).to.eventually.eql({ some: 'data' });
      });
    });

    context('unsuccesful request', () => {

      it('rejects if credentials are not valid', () => {
        let expectedRequest = habiticaUrl.reply(function () {
          return [401, 'Not allowed'];
        });

        let connection = new Connection(defaultOptions);
        let request = connection.post('user/tasks');

        expectedRequest.done();
        return expect(request).to.be.rejectedWith('Error: Unauthorized');
      });
    });
  });
});
