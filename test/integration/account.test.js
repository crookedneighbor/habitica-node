import {v4 as generateRandomUserName} from 'uuid';
import Habitica from '../../src/index';

describe('Account', () => {
  describe('#register', () => {
    let api, username, password, email;

    beforeEach(() => {
      api = new Habitica({
        endpoint: `localhost:${process.env.PORT}/api/v2`,
      });
      username = generateRandomUserName();
      password = 'password'
      email = username + '@example.com';
    });

    it('registers for a new account', (done) => {
      api.account.register(username, email, password)
        .then((user) => {
          expect(user._id).to.exist;
          expect(user.apiToken).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('sets uuid and api token to new user', (done) => {
      expect(api._uuid).to.not.exist;
      expect(api._token).to.not.exist;

      let username = generateRandomUserName();
      let password = 'password'
      let email = username + '@example.com';

      api.account.register(username, email, password)
        .then((user) => {
          expect(api._connection._uuid).to.be.eql(user._id);
          expect(api._connection._token).to.be.eql(user.apiToken);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
