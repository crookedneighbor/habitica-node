import {
  HabiticaApiError,
  UnknownConnectionError,
  IntegrationError
} from '../../src/lib/errors'

describe('Errors', () => {
  describe('UnknownConnectionError', () => {
    it('instantiates an error', () => {
      let error = new UnknownConnectionError()

      expect(error).to.be.an.instanceof(HabiticaApiError)
      expect(error.name).to.equal('HabiticaApiUnknownError')
      expect(error.message).to.equal('An unknown error occurred')
    })

    it('saves original error', () => {
      let originalError = new Error('foo')
      let error = new UnknownConnectionError(originalError)

      expect(error.originalError).to.equal(originalError)
    })

    it('does not overwrite error from original error', () => {
      let originalError = new Error('foo')
      let error = new UnknownConnectionError(originalError)

      expect(error.message).to.eql('An unknown error occurred')
    })
  })

  describe('HabiticaApiError', () => {
    it('instantiates an API error', () => {
      let responseError = {
        status: 404,
        type: 'NotFound',
        message: 'User not found.'
      }
      let error = new HabiticaApiError(responseError)

      expect(error.name).to.equal('HabiticaApiNotFoundError')
      expect(error.type).to.equal('NotFound')
      expect(error.status).to.equal(404)
      expect(error.message).to.equal('User not found.')
    })
  })

  describe('IntegrationError', () => {
    it('instantiates an IntegrationError', () => {
      let intError = new IntegrationError('MISSING_ARGUMENT', 'Missing argument')

      expect(intError.name).to.equal('IntegrationError')
      expect(intError.type).to.equal('MISSING_ARGUMENT')
      expect(intError.message).to.equal('Missing argument')
    })

    it('requires type to be of enumerated types', () => {
      expect(function () {
        new IntegrationError('FOO', 'foo')
      }).to.throw(/^type must be one of/)
    })
  })
})
