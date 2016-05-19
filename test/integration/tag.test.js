import {v4 as makeUuid} from 'uuid'
import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors'

describe('Tag', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v3`
  })

  beforeEach(async function () {
    this.tag1id = makeUuid()
    this.tag2id = makeUuid()
    let update = {
      'tags': [
        {
          id: this.tag1id,
          name: 'tag 1'
        },
        {
          id: this.tag2id,
          name: 'tag 2'
        }
      ]
    }
    await generateUser(update, api)
  })

  describe('#get', () => {
    it('gets all tags', async function () {
      let tags = await api.tag.get()

      expect(tags).to.have.a.lengthOf(2)
      expect(tags).to.include({
        id: this.tag1id,
        name: 'tag 1'
      })
      expect(tags).to.include({
        id: this.tag2id,
        name: 'tag 2'
      })
    })

    it('gets a specific tag by id', async function () {
      let tag = await api.tag.get(this.tag1id)

      expect(tag.id).to.eql(this.tag1id)
      expect(tag.name).to.eql('tag 1')
    })

    it('throws error if tag does not exist', async function () {
      await expect(api.tag.get('tag-that-does-not-exist'))
        .to.eventually.be.rejected
    })
  })

  describe('#post', () => {
    it('creates a new tag', async function () {
      let tag = await api.tag.post({
        name: 'new tag'
      })

      let fetchedTag = await api.tag.get(tag.id)

      expect(fetchedTag.id).to.exist
      expect(fetchedTag.id).to.eql(tag.id)
      expect(fetchedTag.name).to.eql('new tag')
    })
  })

  describe('#put', () => {
    it('updates an existing tag', async function () {
      let tag = await api.tag.put(
        this.tag1id,
        { name: 'updated tag name' }
      )

      expect(tag.id).to.eql(this.tag1id)
      expect(tag.name).to.eql('updated tag name')
    })

    it('throws an error if no tag id is provided', async function () {
      let err = new IME.MissingArgumentError('Tag id is required')

      await expect(api.tag.put())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('throws an error if no tag body is provided', async function () {
      let err = new IME.MissingArgumentError('Tag body is required')

      await expect(api.tag.put(this.tag1id))
        .to.eventually.be.rejected.and.eql(err)
    })

    it('returns error if tag does not exist', async function () {
      await expect(api.tag.put(
        'tag-does-not-exist',
        { name: 'updated tag name' }
      )).to.eventually.be.rejected
    })
  })

  describe('#del', () => {
    it('deletes an existing tag', async function () {
      await api.tag.del(this.tag1id)

      await expect(api.tag.get(this.tag1id))
        .to.eventually.be.rejected
    })

    it('throws an error if no tag id is provided', async function () {
      let err = new IME.MissingArgumentError('Tag id is required')

      await expect(api.tag.del())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('returns error if tag does not exist', async function () {
      await expect(api.tag.del('tag-does-not-exist'))
        .to.eventually.be.rejected
    })
  })
})
