import {generateUser} from '../support/integration_helper';
import {each} from 'lodash';
import {v4 as generateRandomUserName} from 'uuid';
import Habitica from '../../src/index';
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors';

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
      it('registers for a new account', async () => {
        await api.account.register(username, email, password);
        let user = await api.user.get();

        expect(user.auth.local.username).to.eql(username);
        expect(user.auth.local.email).to.eql(email);
      });

      it('returns a new user', async () => {
        let user = await api.account.register(username, email, password);

        expect(user._id).to.exist;
        expect(user.apiToken).to.exist;
        expect(user.auth.local.username).to.eql(username);
        expect(user.auth.local.email).to.eql(email);
      });

      it('sets uuid and api token to new user', async () => {
        expect(api._uuid).to.not.exist;
        expect(api._token).to.not.exist;

        let user = await api.account.register(username, email, password);
        expect(api.getUuid()).to.be.eql(user._id);
        expect(api.getToken()).to.be.eql(user.apiToken);
      });
    });

    context('Uuid or token already set', () => {
      it('throws an error if uuid is already set', async () => {
        api.setCredentials({uuid: 'some-uuid'});
        let err = new IME.InvalidActionError('User id or api token already set');

        await expect(api.account.register(username, email, password))
          .to.eventually.be.rejected.and.eql(err);
      });

      it('throws an error if token is already set', async () => {
        api.setCredentials({token: 'some-token'});
        let err = new IME.InvalidActionError('User id or api token already set');

        await expect(api.account.register(username, email, password))
          .to.eventually.be.rejected.and.eql(err);
      });

      it('allows the creation of a new user when uuid or token is already set if resetOldCreds option is passed in', async () => {
        api.setCredentials({uuid: 'some-uuid', token: 'some-token'});

        let user = await api.account.register(username, email, password, {resetOldCreds: true });

        expect(api.getUuid()).to.be.eql(user._id);
        expect(api.getToken()).to.be.eql(user.apiToken);
      });
    });

    context('Invalid Input', () => {
      it('resolves with error when username is not provided', async () => {
        await expect(api.account.register('', email, password)).to.eventually.be.rejected;
      });

      it('resolves with error when email is not provided', async () => {
        await expect(api.account.register(username, '', password)).to.eventually.be.rejected;
      });

      it('resolves with error when password is not provided', async () => {
        await expect(api.account.register(username, email, '')).to.eventually.be.rejected
      });

      it('resolves with error when email is not valid', async () => {
        await expect(api.account.register(username, 'not.a.valid.email@example', password)).to.eventually.be.rejected;
      });
    });
  });

  describe('#login', () => {
    let api, username, password, email;

    beforeEach(async () => {
      let registerApi = new Habitica({
        endpoint: `localhost:${process.env.PORT}/api/v2`,
      });
      api = new Habitica({
        endpoint: `localhost:${process.env.PORT}/api/v2`,
      });

      username = generateRandomUserName();
      password = 'password'
      email = username + '@example.com';

      await registerApi.account.register(username, email, password)
    });

    context('Success', () => {
      it('logs in with username and password', async () => {
        let creds = await api.account.login(username, password);

        expect(creds.id).to.exist;
        expect(creds.token).to.exist;
      });

      it('sets uuid and token after logging in with username', async () => {
        let creds = await api.account.login(username, password);

        expect(api.getUuid()).to.be.eql(creds.id);
        expect(api.getToken()).to.be.eql(creds.token);
      });

      it('logs in with email and password', async () => {
        let creds = await api.account.login(email, password)

        expect(creds.id).to.exist;
        expect(creds.token).to.exist;
      });

      it('sets uuid and token after logging in with email', async () => {
        let creds = await api.account.login(email, password)

        expect(api.getUuid()).to.be.eql(creds.id);
        expect(api.getToken()).to.be.eql(creds.token);
      });
    });

    context('Failures', () => {
      it('resolves with error when account is not provided', async () => {
        await expect(api.account.login(null, password)).to.eventually.be.rejected;
      });

      it('resolves with error when account is not provided', async () => {
        await expect(api.account.login(username, null)).to.eventually.be.rejected;
      });

      it('resolves with error when account does not exist', async () => {
        await expect(api.account.login('not-existant', password)).to.eventually.be.rejected;
      });

      it('resolves with error when password does not match', async () => {
        await expect(api.account.login(username, 'password-not-correct')).to.eventually.be.rejected;
      });
    });
  });
});
