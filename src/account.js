import {
  reject,
  isEmpty,
  isString,
} from 'lodash';

export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  register (username, email, password, options={}) {
    if (this._connection._uuid || this._connection._token) {
      if (!options.resetOldCreds) {
        throw 'User id or api token already set';
      }

      this._connection.setCredentials({uuid: null, token: null});
    }

    let creds = {
      username: username,
      email: email,
      password: password,
      confirmPassword: password,
    };

    return this._connection.post('register', {send: creds})
      .then((user) => {
        this._connection.setCredentials({
          uuid: user._id,
          token: user.apiToken,
        });
        return user;
      });
  }

  login (username_email, password, options={}) {
    let creds = {
      username: username_email,
      password: password,
    };
    return this._connection.post('user/auth/local', {send: creds})
      .then((creds) => {
        this._connection.setCredentials({
          uuid: creds.id,
          token: creds.token,
        });
        return creds;
      })
      .catch((err) => {
        throw err;
      });
  }

}
