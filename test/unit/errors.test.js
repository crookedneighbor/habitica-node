'use strict'

var errors = require('../../lib/errors')
var HabiticaApiError = errors.HabiticaApiError
var UnknownConnectionError = errors.UnknownConnectionError
var IntegrationError = errors.IntegrationError

describe('Errors', function () {
  describe('UnknownConnectionError', function () {
    it('instantiates an error', function () {
      var error = new UnknownConnectionError()

      expect(error).to.be.an.instanceof(HabiticaApiError)
      expect(error.name).to.equal('HabiticaApiUnknownError')
      expect(error.message).to.equal('An unknown error occurred')
    })

    it('saves original error', function () {
      var originalError = new Error('foo')
      var error = new UnknownConnectionError(originalError)

      expect(error.originalError).to.equal(originalError)
    })

    it('does not overwrite error from original error', function () {
      var originalError = new Error('foo')
      var error = new UnknownConnectionError(originalError)

      expect(error.message).to.equal('An unknown error occurred')
    })
  })

  describe('HabiticaApiError', function () {
    it('instantiates an API error', function () {
      var responseError = {
        status: 404,
        type: 'NotFound',
        message: 'User not found.'
      }
      var error = new HabiticaApiError(responseError)

      expect(error.name).to.equal('HabiticaApiNotFoundError')
      expect(error.type).to.equal('NotFound')
      expect(error.status).to.equal(404)
      expect(error.message).to.equal('User not found.')
    })
  })

  describe('IntegrationError', function () {
    it('instantiates an IntegrationError', function () {
      var intError = new IntegrationError('MISSING_ARGUMENT', 'Missing argument')

      expect(intError.name).to.equal('IntegrationError')
      expect(intError.type).to.equal('MISSING_ARGUMENT')
      expect(intError.message).to.equal('Missing argument')
    })

    it('requires type to be of enumerated types', function () {
      expect(function () {
        new IntegrationError('FOO', 'foo') // eslint-disable-line no-new
      }).to.throw(/^type must be one of/)
    })
  })
})
