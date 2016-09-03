'use strict'

var Habitica = require('../../src/index')

describe('Habitica Api', function () {
  beforeEach(function () {
    this.api = new Habitica({uuid: 'myUuid', token: 'myToken'})
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

  describe('#setCredentials', function () {
    it('sets new credentials', function () {
      this.api.setCredentials({uuid: 'newUuid', token: 'newToken'})

      expect(this.api.getUuid()).to.equal('newUuid')
      expect(this.api.getToken()).to.equal('newToken')
    })
  })
})
