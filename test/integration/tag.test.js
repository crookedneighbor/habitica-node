import {generateUser} from '../support/integration_helper';
import Habitica from '../../src/index';

describe('Tag', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v2`,
  });

  beforeEach(async () => {
    let update = {
      'tags': [
        {
          id: 'tag-1',
          name: 'tag 1',
        },
        {
          id: 'tag-2',
          name: 'tag 2',
        },
      ],
    }
    await generateUser(update, api);
  });

  describe('#get', () => {
    it('gets all tags', async () => {
      let tags = await api.tag.get();

      expect(tags).to.have.a.lengthOf(2);
      expect(tags).to.include({
        id: 'tag-1',
        name: 'tag 1',
      });
      expect(tags).to.include({
        id: 'tag-2',
        name: 'tag 2',
      });
    });

    it('gets a specific tag by id', async () => {
      let tag = await api.tag.get('tag-1');

      expect(tag.id).to.eql('tag-1');
      expect(tag.name).to.eql('tag 1');
    });

    it('throws error if tag does not exist', async () => {
      await expect(api.tag.get('tag-that-does-not-exist'))
        .to.eventually.be.rejected;
    });
  });

  describe('#post', () => {
    it('creates a new tag', async () => {
      let tags = await api.tag.post({
        name: 'new tag',
      });

      let tag = _.find(tags, {name: 'new tag'});
      let fetchedTag = await api.tag.get(tag.id);

      expect(fetchedTag.id).to.exist;
      expect(fetchedTag.name).to.eql('new tag');
    });

    it('creates a new tag with specified tag attributes', async () => {
      let tags = await api.tag.post({
        name: 'new tag',
        id: 'new-tag-id',
      })

      expect(tags).to.include({
        name: 'new tag',
        id: 'new-tag-id',
      });
    });
  });

  describe('#put', () => {
    it('updates an existing tag', async () => {
      let tag = await api.tag.put(
        'tag-1',
        { name: 'updated tag name' }
      );

      expect(tag.id).to.eql('tag-1');
      expect(tag.name).to.eql('updated tag name');
    });

    it('throws an error if no tag id is provided', async () => {
      await expect(api.tag.put())
        .to.eventually.be.rejected.and.eql('Tag id is required');
    });

    it('throws an error if no tag body is provided', async () => {
      await expect(api.tag.put('tag-1'))
        .to.eventually.be.rejected.and.eql('Tag body is required');
    });

    it('returns error if tag does not exist', async () => {
      await expect(api.tag.put(
        'tag-does-not-exist',
        { name: 'updated tag name' }
      )).to.eventually.be.rejected;
    });
  });

  describe('#del', () => {
    it('deletes an existing tag', async () => {
      await api.tag.del('tag-1');

      await expect(api.tag.get('tag-1'))
        .to.eventually.be.rejected;
    });

    it('returns the remaining tags', async () => {
      let tags = await api.tag.del('tag-1')

      expect(tags).to.eql([{id: 'tag-2', name: 'tag 2'}]);
    });

    it('throws an error if no tag id is provided', async () => {
      await expect(api.tag.del())
        .to.eventually.be.rejected.and.eql('Tag id is required');
    });

    it('returns error if tag does not exist', async () => {
      await expect(api.tag.del('tag-does-not-exist'))
        .to.eventually.be.rejected;
    });
  });
});
