import Connection from '../../src/connection';
import Content from '../../src/content';

describe('Content', () => {
  let habit;
  let connection = new Connection({
    uuid: 'myUuid',
    token: 'myToken',
  });
  let content = new Content({connection: connection});

  describe('#get', () => {
    let fixture = require('../support/fixtures/content.json');

    beforeEach(() => {
      habit = nock(endpoint)
        .get('/content')
        .reply(200, fixture);
    });

    it('requests all content', (done) => {
      content.get()
        .then((result) => {
          expect(result.eggs).to.exist;
          expect(result.quests).to.exist;
          expect(result.gear).to.exist;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('requests content for user\'s specified language');
  });

  describe('#getPaths', () => {
    let fixture = require('../support/fixtures/content_paths.json');

    beforeEach(() => {
      habit = nock(endpoint)
        .get('/content/paths')
        .reply(200, fixture);
    });

    it('requests content paths', (done) => {
      content.getPaths()
        .then((result) => {
          expect(result._id).to.exist;
          expect(result.apiToken).to.exist;
          expect(result['contributor.level']).to.exist;
          expect(result['items.gear.owned.weapon_warrior_0']).to.exist;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
