import Habitica from '../../src/'
import { updateDocument, generateUser } from '../support/integration_helper'

describe('Habitica', function () {
  beforeEach(async function () {
    this.api = new Habitica({
      endpoint: `localhost:${process.env.PORT}/`
    })
    await generateUser(null, this.api)
  })

  describe('#get', function () {
    it('sends a GET request to Habitica', function () {
      return this.api.get('/user').then((res) => {
        let user = res.data

        expect(user._id).to.eql(this.api.getUuid())
      })
    })

    it('can send query parameters', function () {
      return this.api.get('/groups', {
        type: 'tavern'
      }).then((res) => {
        let groups = res.data
        let tavern = groups.find(group => group.id === '00000000-0000-4000-A000-000000000000')

        expect(tavern).to.exist
        expect(tavern.name).to.equal('Tavern')
      })
    })
  })

  describe('#post', function () {
    it('sends a POST request to Habitica', function () {
      return updateDocument('users', this.api.getUuid(), {
        'stats.hp': 20,
        'stats.gp': 100
      }).then(() => {
        return this.api.post('/user/buy-health-potion')
      }).then((res) => {
        let stats = res.data

        expect(stats.hp).to.be.greaterThan(20)
      })
    })

    it('can send a body object', function () {
      return this.api.post('/tasks/user', {
        text: 'Task Name',
        notes: 'Task Notes',
        type: 'todo'
      }).then((res) => {
        let task = res.data

        expect(task.text).to.equal('Task Name')
        expect(task.notes).to.equal('Task Notes')
      })
    })

    it('can send query parameters', function () {
      return updateDocument('users', this.api.getUuid(), {
        'stats.lvl': 20,
        'stats.points': 20
      }).then(() => {
        return this.api.post('/user/allocate', null, {
          stat: 'int'
        })
      }).then((res) => {
        let stats = res.data

        expect(stats.int).to.equal(1)
      })
    })
  })

  describe('#put', function () {
    it('sends a PUT request to Habitica with a body object', function () {
      return this.api.put('/user', {
        'profile.name': 'New Name'
      }).then((res) => {
        let user = res.data

        expect(user.profile.name).to.equal('New Name')
      })
    })

    it('can send query parameters', function () {
      return this.api.put('/user', {
        'profile.name': 'foo'
      }, {
        userV: 1
      }).then((res) => {
        let userV = res.userV

        expect(userV).to.be.greaterThan(1)
      })
    })
  })

  describe('#del', function () {
    it('sends a DEL request to Habitica', function () {
      return this.api.post('/tasks/user', { type: 'habit', text: 'text' }).then((res) => {
        return this.api.del(`/tasks/${res.data.id}`)
      }).then((res) => {
        expect(res.success).to.be.true
      })
    })

    it('can send a body object', function () {
      return this.api.del('/user', {
        password: 'password'
      }).then((res) => {
        expect(res.success).to.be.true
      })
    })

    it('can send query parameters', function () {
      return this.api.post('/tasks/user', { type: 'habit', text: 'text' }).then((res) => {
        return this.api.del(`/tasks/${res.data.id}`, null, {
          userV: 1
        })
      }).then((res) => {
        expect(res.userV).be.greaterThan(2)
      })
    })
  })
})
