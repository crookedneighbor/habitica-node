'use strict'

var Habitica = require('../../index')
var errors = require('../../lib/errors')

describe('Habitica Api', function () {
  beforeEach(function () {
    this.api = new Habitica({uuid: 'myUuid', token: 'myToken'})
  })

  describe('ApiError', function () {
    it('is the HabiticaApiError object', function () {
      expect(Habitica.ApiError).to.equal(errors.HabiticaApiError)
    })
  })

  describe('UnknownConnectionError', function () {
    it('is the HabiticaApiError object', function () {
      expect(Habitica.UnknownConnectionError).to.equal(errors.UnknownConnectionError)
    })
  })

  describe('#getOptions', function () {
    it('returns an object with the configured options', function () {
      var options = this.api.getOptions()

      expect(options).to.deep.equal({
        uuid: 'myUuid',
        token: 'myToken',
        endpoint: 'https://habitica.com/',
        platform: 'Habitica-Node'
      })
    })
  })

  describe('#setOptions', function () {
    it('sets new options', function () {
      this.api.setOptions({uuid: 'newUuid', token: 'newToken'})

      var options = this.api.getOptions()

      expect(options.uuid).to.equal('newUuid')
      expect(options.token).to.equal('newToken')
    })
  })
})
