import Habitica from '../../src/index'
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors'

describe('Content', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v3`
  })

  describe('#get', () => {
    it('gets all content if no argument is provided', async function () {
      let res = await api.content.get()

      expect(res.eggs).to.exist
      expect(res.quests).to.exist
      expect(res.gear).to.exist
    })

    it('gets specific piece of content if valid argument is provided', async function () {
      let res = await api.content.get('eggs')

      expect(res.Wolf).to.exist
      expect(res.Whale).to.exist
    })

    it('gets specific piece of content file with nested argument', async function () {
      let res = await api.content.get('gear.tree.weapon.warrior')

      expect(res['0']).to.exist
    })

    it('resolves with error if an invalid argument is provided', async function () {
      let err = new IME.InvalidActionError('invalid-content-path is not a valid content path')

      await expect(api.content.get('invalid-content-path'))
        .to.eventually.be.rejected.and.eql(err)
    })
  })

  describe('#getKeys', () => {
    it('gets top level keys of content object', async function () {
      let res = await api.content.getKeys()

      expect(res).to.contain('eggs')
      expect(res).to.contain('quests')
    })

    it('gets keys of a specific piece of content', async function () {
      let res = await api.content.getKeys('eggs')

      expect(res).to.contain('Wolf')
      expect(res).to.contain('Whale')
    })

    it('gets keys of specific piece of content file with nested argument', async function () {
      let res = await api.content.getKeys('gear.tree.weapon.warrior')

      expect(res).to.contain('0')
      expect(res).to.contain('1')
      expect(res).to.contain('2')
    })

    it('resolves with error if an invalid argument is provided', async function () {
      let err = new IME.InvalidActionError('invalid-content-path is not a valid content path')

      await expect(api.content.getKeys('invalid-content-path'))
        .to.eventually.be.rejected.and.eql(err)
    })
  })
})
