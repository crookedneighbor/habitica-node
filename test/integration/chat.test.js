import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors'

describe('Chat', () => {
  let group
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v3`
  })

  beforeEach(async function () {
    await generateUser({
      balance: 20
    }, api)

    // TODO switch out for group method when available
    group = (await api._connection.post('groups', {
      send: {
        name: 'some group',
        type: 'guild',
        privacy: 'public'
      }
    }).catch((err) => {
      throw err
    })).data
  })

  describe('#post', function () {
    it('creates a new message', async function () {
      let message = await api.chat.post(group.id, {
        message: 'a message'
      })

      expect(message.text).to.eql('a message')
      expect(message.id).to.exist
      expect(message.uuid).to.eql(api.getUuid())
    })

    it('requires a group id', async function (done) {
      try {
        await api.chat.post()
      } catch (err) {
        expect(err).to.be.an.instanceof(IME.MissingArgumentError)
        expect(err.message).to.eql('Group Id is required')

        done()
      }
    })

    it('requires a message param', async function (done) {
      try {
        await api.chat.post(group.id, {})
      } catch (err) {
        expect(err).to.be.an.instanceof(IME.MissingArgumentError)
        expect(err.message).to.eql('Message is a required param')

        done()
      }
    })
  })
})
