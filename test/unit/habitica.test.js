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

  describe('#getUuid', function () {
    it('returns uuid', function () {
      expect(this.api.getUuid()).to.equal('myUuid')
    })
  })

  describe('#getToken', function () {
    it('returns token', function () {
      expect(this.api.getToken()).to.equal('myToken')
    })
  })

  describe('#getEndpoint', function () {
    it('returns token', function () {
      expect(this.api.getEndpoint()).to.equal('https://habitica.com/')
    })
  })

  describe('#setOptions', function () {
    it('sets new options', function () {
      this.api.setOptions({uuid: 'newUuid', token: 'newToken'})

      expect(this.api.getUuid()).to.equal('newUuid')
      expect(this.api.getToken()).to.equal('newToken')
    })
  })
})
