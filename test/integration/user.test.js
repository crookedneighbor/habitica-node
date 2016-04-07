import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'

describe('User', () => {
  describe('#get', () => {
    let api = new Habitica({
      endpoint: `localhost:${process.env.PORT}/api/v2`
    })

    beforeEach(async function () {
      await generateUser(null, api)
    })

    it('gets user object', async function () {
      let user = await api.user.get()

      expect(user._id).to.eql(api.getUuid())
      expect(user).to.include.keys(['todos', 'habits', 'dailys', 'rewards'])
      expect(user).to.include.keys(['stats', 'balance', 'preferences', 'flags'])
    })
  })
})
