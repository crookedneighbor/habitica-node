import Habitica from '../../src/index';

describe('Content', () => {
  let api = new Habitica({
    uuid: 'foo',
    token: 'bar',
    endpoint: 'localhost:3000/api/v2',
  });

  describe('#get', () => {
    it('gets content', (done) => {
      api.content.get()
        .then((res) => {
          expect(res.eggs).to.exist;
          expect(res.quests).to.exist;
          expect(res.gear).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getPaths', () => {
    it('gets content paths', (done) => {
      api.content.getPaths()
        .then((res) => {
          expect(res._id).to.exist;
          expect(res.apiToken).to.exist;
          expect(res['contributor.level']).to.exist;
          expect(res['items.gear.owned.weapon_warrior_0']).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getEggs', () => {
    it('gets eggs object', (done) => {
      api.content.getEggs()
        .then((res) => {
          expect(res.Wolf).to.exist;
          expect(res.Whale).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getGearTree', () => {
    it('gets gear tree object', (done) => {
      api.content.getGearTree()
        .then((res) => {
          expect(res.weapon).to.exist;
          expect(res.armor).to.exist;
          expect(res.head).to.exist;
          expect(res.shield).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getGearFlat', () => {
    it('gets gear flat object', (done) => {
      api.content.getGearFlat()
        .then((res) => {
          expect(res.weapon_warrior_0).to.exist;
          expect(res.armor_warrior_1).to.exist;
          expect(res.head_warrior_1).to.exist;
          expect(res.shield_warrior_1).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getQuests', () => {
    it('gets quests object', (done) => {
      api.content.getQuests()
        .then((res) => {
          expect(res.atom1).to.exist;
          expect(res.whale).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
