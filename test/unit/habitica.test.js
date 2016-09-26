'use strict'

var Habitica = require('../../index')
var errors = require('../../lib/errors')
var requireAgain = require('require-again')

describe('Habitica Api', function () {
  beforeEach(function () {
    this.api = new Habitica({id: 'myUuid', apiToken: 'myToken'})
  })

  it('requires Promises', function () {
    var PromiseObject = Promise

    Promise = undefined

    expect(function () {
      requireAgain('../../index')
    }).to.throw('Promise could not be found in this context. You must polyfill it to use this module.')

    Promise = PromiseObject
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
        id: 'myUuid',
        apiToken: 'myToken',
        endpoint: 'https://habitica.com',
        platform: 'Habitica-Node'
      })
    })
  })

  describe('#setOptions', function () {
    it('sets new options', function () {
      this.api.setOptions({id: 'newUuid', apiToken: 'newToken'})

      var options = this.api.getOptions()

      expect(options.id).to.equal('newUuid')
      expect(options.apiToken).to.equal('newToken')
    })
  })
})
