import nock from 'nock'
import Connection from '../../src/lib/connection'
import {
  HabiticaApiError,
  UnknownConnectionError
} from '../../src/lib/errors'

describe('Connection', function () {
  beforeEach(function () {
    this.defaultOptions = {
      uuid: 'myUuid',
      token: 'myToken'
    }
  })

  describe('initialization', function () {
    it('defaults to habitica endpoint', function () {
      let connection = new Connection(this.defaultOptions)
      expect(connection._endpoint).to.equal('https://habitica.com/')
    })

    it('accepts an override for endpoint', function () {
      let connection = new Connection({
        uuid: 'myUuid',
        token: 'myToken',
        endpoint: 'https://someotherendpoint/'
      })

      expect(connection._endpoint).to.equal('https://someotherendpoint/')
    })

    it('adds the trailing slash to the endpoint if it is missing', function () {
      let connection = new Connection({
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

    it('rejects with connection error if habit is unreachable', async function () {
      let request = this.connection.get('/user')

      let unknownError = new UnknownConnectionError()

      await expect(request).to.eventually.be.rejected.and.have.property('message', unknownError.message)
    })
  })

  describe('#getUuid', function () {
    it('returns uuid', function () {
      let connection = new Connection(this.defaultOptions)
      expect(connection.getUuid()).to.equal('myUuid')
    })
  })

  describe('#getToken', function () {
    it('returns token', function () {
      let connection = new Connection(this.defaultOptions)
      expect(connection.getToken()).to.equal('myToken')
    })
  })

  describe('#getEndpoint', function () {
    it('returns endpoint', function () {
      let connection = new Connection(this.defaultOptions)
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
      let request = this.connection.get('/user')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .get('/group')
        .query({type: 'party'})
        .reply(200)

      await this.connection.get('/group', {query: {type: 'party'}})

      expectedRequest.done()
    })

    it('ignores send parameter if passed in', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .get('/group')
        .reply(200)

      await this.connection.get('/group', {send: {type: 'party'}})

      expectedRequest.done()
    })

    context('succesful request', function () {
      it('returns requested data', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        let connection = new Connection(this.defaultOptions)
        let response = await connection.get('/user')

        expect(response).to.deep.equal({ some: 'data' })
        expectedRequest.done()
      })
    })

    context('unsuccesful request', function () {
      it('passes on error data from API', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [404, {
            success: false,
            error: 'NotFound',
            message: 'User not found.'
          }]
        })

        let connection = new Connection(this.defaultOptions)

        await connection.get('/user').catch((err) => {
          expect(err).to.be.an.instanceof(HabiticaApiError)
          expect(err.status).to.equal(404)
          expect(err.name).to.equal('HabiticaApiNotFoundError')
          expect(err.type).to.equal('NotFound')
          expect(err.message).to.equal('User not found.')
        })

        expectedRequest.done()
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
      let connection = new Connection(this.defaultOptions)
      let request = connection.post('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .post('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      let connection = new Connection(this.defaultOptions)
      await connection.post('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      })

      expectedRequest.done()
    })

    it('takes in an optional send parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .post('/group', {
          type: 'party'
        })
        .reply(200)

      let connection = new Connection(this.defaultOptions)
      await connection.post('/group', {send: {type: 'party'}})

      expectedRequest.done()
    })

    context('succesful request', function () {
      it('returns requested data', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        let connection = new Connection(this.defaultOptions)
        let response = await connection.post('/user/tasks')

        expect(response).to.deep.equal({ some: 'data' })
        expectedRequest.done()
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        let connection = new Connection(this.defaultOptions)
        await expect(connection.post('/user/tasks')).to.eventually.be.rejected

        expectedRequest.done()
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
      let connection = new Connection(this.defaultOptions)
      let request = connection.put('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .put('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      let connection = new Connection(this.defaultOptions)
      await connection.put('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      })

      expectedRequest.done()
    })

    it('takes in an optional send parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .put('/group', {
          type: 'party'
        })
        .reply(200)

      let connection = new Connection(this.defaultOptions)
      await connection.put('/group', {send: {type: 'party'}})

      expectedRequest.done()
    })

    context('succesful request', function () {
      it('returns requested data', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        let connection = new Connection(this.defaultOptions)
        let response = await connection.put('/user/tasks')

        expect(response).to.deep.equal({ some: 'data' })
        expectedRequest.done()
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        let connection = new Connection(this.defaultOptions)
        await expect(connection.put('/user/tasks')).to.eventually.be.rejected

        expectedRequest.done()
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
      let connection = new Connection(this.defaultOptions)
      let request = connection.del('/user/tasks')

      expect(request).to.be.a('promise')
    })

    it('takes in an optional query parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .delete('/user/tasks')
        .query({
          type: 'habit',
          text: 'test habit'
        })
        .reply(201, {})

      let connection = new Connection(this.defaultOptions)
      await connection.del('/user/tasks', {
        query: {
          type: 'habit',
          text: 'test habit'
        }
      })

      expectedRequest.done()
    })

    it('takes in an optional send parameter', async function () {
      let expectedRequest = nock('https://habitica.com/api/v3')
        .delete('/group', {
          type: 'party'
        })
        .reply(200)

      let connection = new Connection(this.defaultOptions)
      await connection.del('/group', {send: {type: 'party'}})

      expectedRequest.done()
    })

    context('succesful request', function () {
      it('returns requested data', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [200, { some: 'data' }]
        })

        let connection = new Connection(this.defaultOptions)
        let response = await connection.del('/user/tasks')

        expect(response).to.deep.equal({ some: 'data' })
        expectedRequest.done()
      })
    })

    context('unsuccesful request', function () {
      it('rejects if credentials are not valid', async function () {
        let expectedRequest = this.habiticaUrl.reply(function () {
          return [401, {response: {status: 401, text: 'Not Authorized'}}]
        })

        let connection = new Connection(this.defaultOptions)
        await expect(connection.del('/user/tasks')).to.eventually.be.rejected

        expectedRequest.done()
      })
    })
  })
})
