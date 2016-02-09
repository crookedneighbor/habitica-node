import {generateUser} from '../support/integration_helper';
import Habitica from '../../src/index';

describe('Tag', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v2`,
  });

  beforeEach((done) => {
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
    generateUser(update, api)
      .then((creds) => {
        done();
      });
  });

  describe('#get', () => {
    it('gets all tags', (done) => {
      api.tag.get()
        .then((tags) => {
          expect(tags).to.have.a.lengthOf(2);
          expect(tags).to.include({
            id: 'tag-1',
            name: 'tag 1',
          });
          expect(tags).to.include({
            id: 'tag-2',
            name: 'tag 2',
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('gets a specific tag by id', (done) => {
      api.tag.get('tag-1')
        .then((tag) => {
          expect(tag.id).to.eql('tag-1');
          expect(tag.name).to.eql('tag 1');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('throws error if tag does not exist', (done) => {
      api.tag.get('tag-that-does-not-exist')
        .then((tag) => {
          done(tag);
        })
        .catch((err) => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('#post', () => {
    it('creates a new tag', (done) => {
      api.tag.post({
        name: 'new tag',
      }).then((tags) => {
        let tag = _.find(tags, {name: 'new tag'});
        return api.tag.get(tag.id);
      }).then((tag) => {
        expect(tag.id).to.exist;
        expect(tag.name).to.eql('new tag');
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('creates a new tag with specified tag attributes', (done) => {
      api.tag.post({
        name: 'new tag',
        id: 'new-tag-id',
      }).then((tags) => {
        expect(tags).to.include({
          name: 'new tag',
          id: 'new-tag-id',
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });

  describe('#put', () => {
    it('updates an existing tag', (done) => {
      api.tag.put(
        'tag-1',
        { name: 'updated tag name' }
      ).then((tag) => {
        expect(tag.id).to.eql('tag-1');
        expect(tag.name).to.eql('updated tag name');
        done();
      })
      .catch((err) => {
        done(err);
      });
    });

    it('throws an error if no tag id is provided', async () => {
      await expect(api.tag.put()).to.eventually.be.rejected.and.eql('Tag id is required');
    });

    it('throws an error if no tag body is provided', async () => {
      await expect(api.tag.put('tag-1')).to.eventually.be.rejected.and.eql('Tag body is required');
    });

    it('returns error if tag does not exist', (done) => {
      api.tag.put(
        'tag-does-not-exist',
        { name: 'updated tag name' }
      ).then((tag) => {
        done(tag);
      }).catch((err) => {
        expect(err).to.exist;
        expect(err.text).to.eql('Tag not found.');
        done();
      });
    });
  });

  describe('#del', () => {
    it('deletes an existing tag', (done) => {
      api.tag.del(
        'tag-1'
      ).then((tags) => {
        return api.tag.get('tag-1');
      })
      .then((tag) => {
        done(tag);
      })
      .catch((err) => {
        expect(err).to.exist;
        done();
      });
    });

    it('returns the remaining tags', (done) => {
      api.tag.del('tag-1').then((tags) => {
        expect(tags).to.eql([{id: 'tag-2', name: 'tag 2'}]);
        done();
      })
      .catch((err) => {
        done(err);
      });
    });

    it('throws an error if no tag id is provided', async () => {
      await expect(api.tag.del()).to.eventually.be.rejected.and.eql('Tag id is required');
    });

    it('returns error if tag does not exist', (done) => {
      api.tag.del(
        'tag-does-not-exist'
      ).then((tag) => {
        done(tag);
      }).catch((err) => {
        expect(err).to.exist;
        expect(err.text).to.eql('Tag not found.');
        done();
      });
    });
  });
});
