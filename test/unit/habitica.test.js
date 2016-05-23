import Habitica from '../../src/index'

describe('Habitica Api', () => {
  let api
  beforeEach(() => {
    api = new Habitica({uuid: 'myUuid', token: 'myToken'})
  })

  describe('#getUuid', () => {
    it('returns uuid', () => {
      expect(api.getUuid()).to.eql('myUuid')
    })
  })

  describe('#getToken', () => {
    it('returns token', () => {
      expect(api.getToken()).to.eql('myToken')
    })
  })

  describe('#getEndpoint', () => {
    it('returns token', () => {
      expect(api.getEndpoint()).to.eql('https://habitica.com/api/v3')
    })
  })

  describe('#setCredentials', () => {
    it('sets new credentials', () => {
      api.setCredentials({uuid: 'newUuid', token: 'newToken'})

      expect(api.getUuid()).to.eql('newUuid')
      expect(api.getToken()).to.eql('newToken')
    })
  })
})
