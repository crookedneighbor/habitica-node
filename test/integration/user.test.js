import {generateUser} from '../support/integration_helper';
import Habitica from '../../src/index';

describe('User', () => {
  describe('#get', () => {
    let api = new Habitica({
      endpoint: `localhost:${process.env.PORT}/api/v2`,
    });

    beforeEach((done) => {
      generateUser(null, api)
        .then((creds) => {
          done();
        });
    });

    it('gets user object', (done) => {
      api.user.get()
        .then((user) => {
          expect(user._id).to.eql(api.getUuid());
          expect(user).to.include.keys(['todos', 'habits', 'dailys', 'rewards']);
          expect(user).to.include.keys(['stats', 'balance', 'preferences', 'flags']);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
