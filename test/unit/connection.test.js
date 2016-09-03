'use strict'

var nock = require('nock')
var Connection = require('../../src/lib/connection')
var errors = require('../../src/lib/errors')
var HabiticaApiError = errors.HabiticaApiError
var UnknownConnectionError = errors.UnknownConnectionError

describe('Connection', function () {
  beforeEach(function () {
    this.defaultOptions = {
      uuid: 'myUuid',
      token: 'myToken'
    }
  })

  describe('initialization', function () {
    it('defaults to habitica endpoint', function () {
      var connection = new Connection(this.defaultOptions)
      expect(connection._endpoint).to.equal('https://habitica.com/')
    })

    it('accepts an override for endpoint', function () {
      var connection = new Connection({
        uuid: 'myUuid',
        token: 'myToken',
        endpoint: 'https://someotherendpoint/'
      })

      expect(connection._endpoint).to.equal('https://someotherendpoint/')
    })

    it('adds the trailing slash to the endpoint if it is missing', function () {
      var connection = new Connection({
        uuid: 'myUuid',
        token: 'myToken',
        endpoint: 'https://someotherendpoint'
      })

      expect(connection._endpoint).to.equal('https://someotherendpoint/')
    })
  })

  context('connection error handling', function () {
    before(() => nock.disableNetConnect())

    after(() => nock.enableNetConnect())

    beforeEach(function () {
      this.connection = new Connection(this.defaultOptions)
    })

    it('rejects with connection error if habit is unreachable', function () {
      var request = this.connection.get('/user')

      var unknownError = new UnknownConnectionError()

      return expect(request).to.eventually.be.rejected.and.have.property('message', unknownError.message)
    })
  })

  describe('#getUuid', function () {
    it('returns uuid', function () {
      var connection = new Connection(this.defaultOptions)
      expect(connection.getUuid()).to.equal('myUuid')
    })
  })

  describe('#getToken', function () {
    it('returns token', function () {
      var connection = new Connection(this.defaultOptions)
      expect(connection.getToken()).to.equal('myToken')
    })
  })

  describe('#getEndpoint', function () {
    it('returns endpoint', function () {
      var connection = new Connection(this.defaultOptions)
      expect(connection.getEndpoint()).to.equal('https://habitica.com/')
    })
  })

  describe('#setCredentials', function () {
    beforeEach(function () {
      this.connection = new Connection(this.defaultOptions)
    })

    it('sets uuid after iniitalization', function () {
      expect(this.connection._uuid).to.equal('myUuid')

      this.connection.setCredentials({uuid: 'newUuid'})
      expect(this.connection._uuid).to.equal('newUuid')
    })

    it('leaves old uuid if not passed in after initalization', function () {
      expect(this.connection._uuid).to.equal('myUuid')

      this.connection.setCredentials({token: 'foo'})
      expect(this.connection._uuid).to.equal('myUuid')
    })

    it('leaves old token if not passed in after initalization', function () {
      expect(this.connection._token).to.equal('myToken')

      this.connection.setCredentials({uuid: 'foo'})
      expect(this.connection._token).to.equal('myToken')
    })

    it('sets token after iniitalization', function () {
      expect(this.connection._token).to.equal('myToken')

      this.connection.setCredentials({token: 'newToken'})
      expect(this.connection._token).to.equal('newToken')
    })

    it('leaves old endpoint if not passed in after initalization', function () {
      expect(this.connection._endpoint).to.equal('https://habitica.com/')

      this.connection.setCredentials({uuid: 'foo'})
      expect(this.connection._endpoint).to.equal('https://habitica.com/')
    })

    it('sets endpoint after iniitalization', function () {
      expect(this.connection._endpoint).to.equal('https://habitica.com/')

      this.connection.setCredentials({endpoint: 'http://localhost:3321/'})
      expect(this.connection._endpoint).to.equal('http://localhost:3321/')
    })
  })

  describe('#get', function () {
    beforeEach(function () {
      this.connection = new Connection(this.defaultOptions)
      this.habiticaUrl = nock('https://habitica.com/api/v3').get('/user')
    })

    it('returns a promise', function () {
      var request = this.connection.get('/user')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .get('/group')
        .query({type: 'party'})
        .reply(200)

      return this.connection.get('/group', {query: {type: 'party'}}).then(() => {
        expectedRequest.done()
      })
    })

    it('ignores send parameter if passed in', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .get('/group')
        .reply(200)

      return this.connection.get('/group', {send: {type: 'party'}}).then(() => {
        expectedRequest.done()
      })
    })

    context('succesful request', function () {
      it('returns requested data', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        var connection = new Connection(this.defaultOptions)
        return connection.get('/user').then((response) => {
          expect(response).to.deep.equal({ some: 'data' })
          expectedRequest.done()
        })
      })
    })

    context('unsuccesful request', function () {
      it('passes on error data from API', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [404, {
            success: false,
            error: 'NotFound',
            message: 'User not found.'
          }]
        })

        var connection = new Connection(this.defaultOptions)

        return connection.get('/user').then(() => {
          throw new Error('Expected Rejection')
        }).catch((err) => {
          expect(err).to.be.an.instanceof(HabiticaApiError)
          expect(err.status).to.equal(404)
          expect(err.name).to.equal('HabiticaApiNotFoundError')
          expect(err.type).to.equal('NotFound')
          expect(err.message).to.equal('User not found.')

          expectedRequest.done()
        })
      })
    })
  })

  describe('#post', function () {
    beforeEach(function () {
      this.habiticaUrl = nock('https://habitica.com/api/v3')
        .post('/user/tasks')
    })

    it('returns a promise', function () {
      this.habiticaUrl.reply(function () {
        return [200, { some: 'data' }]
      })
      var connection = new Connection(this.defaultOptions)
      var request = connection.post('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .post('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      var connection = new Connection(this.defaultOptions)
      return connection.post('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      }).then(() => {
        expectedRequest.done()
      })
    })

    it('takes in an optional send parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .post('/group', {
          type: 'party'
        })
        .reply(200)

      var connection = new Connection(this.defaultOptions)
      return connection.post('/group', {send: {type: 'party'}}).then(() => {
        expectedRequest.done()
      })
    })

    context('succesful request', function () {
      it('returns requested data', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        var connection = new Connection(this.defaultOptions)
        return connection.post('/user/tasks').then((response) => {
          expect(response).to.deep.equal({ some: 'data' })
          expectedRequest.done()
        })
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        var connection = new Connection(this.defaultOptions)
        return connection.post('/user/tasks').then(() => {
          throw new Error('Expected Rejection')
        }).catch((err) => {
          expect(err.status).to.equal(401)
          expectedRequest.done()
        })
      })
    })
  })

  describe('#put', function () {
    beforeEach(function () {
      this.habiticaUrl = nock('https://habitica.com/api/v3')
        .put('/user/tasks')
    })

    it('returns a promise', function () {
      this.habiticaUrl.reply(function () {
        return [200, { some: 'data' }]
      })
      var connection = new Connection(this.defaultOptions)
      var request = connection.put('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .put('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      var connection = new Connection(this.defaultOptions)
      return connection.put('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      }).then(() => {
        expectedRequest.done()
      })
    })

    it('takes in an optional send parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .put('/group', {
          type: 'party'
        })
        .reply(200)

      var connection = new Connection(this.defaultOptions)
      return connection.put('/group', {send: {type: 'party'}}).then((response) => {
        expectedRequest.done()
      })
    })

    context('succesful request', function () {
      it('returns requested data', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        var connection = new Connection(this.defaultOptions)
        return connection.put('/user/tasks').then((response) => {
          expect(response).to.deep.equal({ some: 'data' })
          expectedRequest.done()
        })
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        var connection = new Connection(this.defaultOptions)
        return expect(connection.put('/user/tasks')).to.eventually.be.rejected.then((response) => {
          expectedRequest.done()
        })
      })
    })
  })

  describe('#del', function () {
    beforeEach(function () {
      this.habiticaUrl = nock('https://habitica.com/api/v3')
        .delete('/user/tasks')
    })

    it('returns a promise', function () {
      this.habiticaUrl.reply(function () {
        return [200, { some: 'data' }]
      })
      var connection = new Connection(this.defaultOptions)
      var request = connection.del('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .delete('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      var connection = new Connection(this.defaultOptions)
      return connection.del('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      }).then(() => {
        expectedRequest.done()
      })
    })

    it('takes in an optional send parameter', function () {
      var expectedRequest = nock('https://habitica.com/api/v3')
        .delete('/group', {
          type: 'party'
        })
        .reply(200)

      var connection = new Connection(this.defaultOptions)
      return connection.del('/group', {send: {type: 'party'}}).then((response) => {
        expectedRequest.done()
      })
    })

    context('succesful request', function () {
      it('returns requested data', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        var connection = new Connection(this.defaultOptions)
        return connection.del('/user/tasks').then((response) => {
          expect(response).to.deep.equal({ some: 'data' })
          expectedRequest.done()
        })
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', function () {
        var expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        var connection = new Connection(this.defaultOptions)
        return expect(connection.del('/user/tasks')).to.eventually.be.rejected.then((response) => {
          expectedRequest.done()
        })
      })
    })
  })
})
