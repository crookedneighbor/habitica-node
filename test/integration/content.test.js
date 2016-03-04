import Habitica from '../../src/index';

describe('Content', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v2`,
  });

  describe('#get', () => {
    it('gets all content if no argument is provided', async () => {
      let res = await api.content.get();

      expect(res.eggs).to.exist;
      expect(res.quests).to.exist;
      expect(res.gear).to.exist;
    });

    it('gets specific piece of content if valid argument is provided', async () => {
      let res = await api.content.get('eggs');

      expect(res.Wolf).to.exist;
      expect(res.Whale).to.exist;
    });

    it('gets specific piece of content file with nested argument', async () => {
      let res = await api.content.get('gear.tree.weapon.warrior');

      expect(res['0']).to.exist;
    });

    it('throws error if an invalid argument is provided', async () => {
      await expect(api.content.get('invalid-content-path'))
        .to.eventually.be.rejected.and.eql('invalid-content-path is not a valid content path');
    });
  });

  describe('#getKeys', () => {
    it('gets top level keys of content object', async () => {
      let res = await api.content.getKeys();

      expect(res).to.contain('eggs');
      expect(res).to.contain('quests');
    });

    it('gets keys of a specific piece of content', async () => {
      let res = await api.content.getKeys('eggs');

      expect(res).to.contain('Wolf');
      expect(res).to.contain('Whale');
    });

    it('gets keys of specific piece of content file with nested argument', async () => {
      let res = await api.content.getKeys('gear.tree.weapon.warrior');

      expect(res).to.contain('0');
      expect(res).to.contain('1');
      expect(res).to.contain('2');
    });

    it('throws error if an invalid argument is provided', async () => {
      await expect(api.content.getKeys('invalid-content-path'))
        .to.eventually.be.rejected.and.eql('invalid-content-path is not a valid content path');
    });
  });

  describe('#getUserPaths', () => {
    it('gets user paths', async () => {
      let res = await api.content.getUserPaths()

      expect(res._id).to.exist;
      expect(res.apiToken).to.exist;
      expect(res['contributor.level']).to.exist;
      expect(res['items.gear.owned.weapon_warrior_0']).to.exist;
    });
  });
});
