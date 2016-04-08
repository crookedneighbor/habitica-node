import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'

let api = new Habitica({
  endpoint: `localhost:${process.env.PORT}/api/v2`
})

describe('User', () => {
  describe('#get', () => {
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

  describe('#getBuyableGear', () => {
    beforeEach(async function () {
      await generateUser(null, api)
    })

    it('returns array of gear objects in rewards column', async function () {
      let gear = await api.user.getBuyableGear()

      expect(gear.length).to.be.greaterThan(1)

      let item = gear[0]

      expect(item.value).to.be.at.least(0)
      expect(item.type).to.exist
      expect(item.key).to.exist
      expect(item.str).to.be.at.least(0)
      expect(item.con).to.be.at.least(0)
      expect(item.int).to.be.at.least(0)
      expect(item.per).to.be.at.least(0)
    })
  })
})
