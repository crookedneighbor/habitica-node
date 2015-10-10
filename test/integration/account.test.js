import {generateUser} from '../support/integration_helper';
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
      it('registers for a new account', (done) => {
        api.account.register(username, email, password)
          .then((user) => {
            api.user.get()
              .then((user) => {
                expect(user.auth.local.username).to.eql(username);
                expect(user.auth.local.email).to.eql(email);
                done();
              });
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
            expect(api.getUuid()).to.be.eql(user._id);
            expect(api.getToken()).to.be.eql(user.apiToken);
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
            expect(api.getUuid()).to.be.eql(user._id);
            expect(api.getToken()).to.be.eql(user.apiToken);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    context('Invalid Input', () => {
      it('resolves with error when username is not provided', (done) => {
        api.account.register('', email, password)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when email is not provided', (done) => {
        api.account.register(username, '', password)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when password is not provided', (done) => {
        api.account.register(username, email, '')
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when email is not valid', (done) => {
        api.account.register(username, 'not.a.valid.email@example', password)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });
    });
  });

  describe('#login', () => {
    let api, username, password, email;

    beforeEach((done) => {
      let registerApi = new Habitica({
        endpoint: `localhost:${process.env.PORT}/api/v2`,
      });
      api = new Habitica({
        endpoint: `localhost:${process.env.PORT}/api/v2`,
      });

      username = generateRandomUserName();
      password = 'password'
      email = username + '@example.com';

      registerApi.account.register(username, email, password)
        .then((user) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    context('Success', () => {
      it('logs in with username and password', (done) => {
        api.account.login(username, password)
          .then((creds) => {
            expect(creds.id).to.exist;
            expect(creds.token).to.exist;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('sets uuid and token after logging in with username', (done) => {
        api.account.login(username, password)
          .then((creds) => {
            expect(api.getUuid()).to.be.eql(creds.id);
            expect(api.getToken()).to.be.eql(creds.token);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('logs in with email and password', (done) => {
        api.account.login(email, password)
          .then((creds) => {
            expect(creds.id).to.exist;
            expect(creds.token).to.exist;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('sets uuid and token after logging in with email', (done) => {
        api.account.login(email, password)
          .then((creds) => {
            expect(api.getUuid()).to.be.eql(creds.id);
            expect(api.getToken()).to.be.eql(creds.token);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    context('Failures', () => {
      it('resolves with error when account is not provided', (done) => {
        api.account.login(null, password)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when account is not provided', (done) => {
        api.account.login(username, null)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when account does not exist', (done) => {
        api.account.login('not-existant', password)
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });

      it('resolves with error when password does not match', (done) => {
        api.account.login(username, 'password-not-correct')
          .then((creds) => {
            done(creds);
          })
          .catch((err) => {
            expect(err.code).to.eql(401);
            expect(err.text).to.exist;
            done();
          });
      });
    });
  });
});
