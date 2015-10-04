import {each} from 'lodash';
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

    context('Successful', () => {
      xit('registers for a new account', (done) => {
        api.account.register(username, email, password)
          .then((user) => {
            // @TODO: look up member
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('returns a new user', (done) => {
        api.account.register(username, email, password)
          .then((user) => {
            expect(user._id).to.exist;
            expect(user.apiToken).to.exist;
            expect(user.profile.name).to.eql(username);
            expect(user.auth.local.username).to.eql(username);
            expect(user.auth.local.email).to.eql(email);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('sets uuid and api token to new user', (done) => {
        expect(api._uuid).to.not.exist;
        expect(api._token).to.not.exist;

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

    context('Uuid or token already set', () => {
      it('throws an error if uuid is already set', () => {
        api.setCredentials({uuid: 'some-uuid'});

        expect(() => {
          api.account.register(username, email, password);
        }).to.throw('User id or api token already set');
      });

      it('throws an error if token is already set', () => {
        api.setCredentials({token: 'some-token'});

        expect(() => {
          api.account.register(username, email, password);
        }).to.throw('User id or api token already set');
      });

      it('allows the creation of a new user when uuid or token is already set if resetOldCreds option is passed in', () => {
        api.setCredentials({uuid: 'some-uuid', token: 'some-token'});

        api.account.register(username, email, password, {resetOldCreds: true })
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

    context('Invalid Input', () => {
      let invalidCredTypes = [
        '',
        true,
        undefined, // eslint-disable-line no-undefined
        null,
        123,
        ['array', 1],
        {object: 'invalid'},
        () => { return true; },
      ];

      it('throws an error if username is not a string', () => {
        each(invalidCredTypes, (type) => {
          username = type;
          expect(() => {
            api.account.register(username, email, password);
          }).to.throw('Username, email or password is not a string');
        });
      });

      it('throws an error if email is not a string', () => {
        each(invalidCredTypes, (type) => {
          email = type;
          expect(() => {
            api.account.register(username, email, password);
          }).to.throw('Username, email or password is not a string');
        });
      });

      it('throws an error if password is not a string', () => {
        each(invalidCredTypes, (type) => {
          password = type;
          expect(() => {
            api.account.register(username, email, password);
          }).to.throw('Username, email or password is not a string');
        });
      });
    });
  });
});