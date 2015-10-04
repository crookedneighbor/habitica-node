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

    let validCreds = _generateCreds(username, email, password);
    if (!validCreds) throw 'Username, email or password is not a string';

    return this._connection.post('register', {send: validCreds})
      .then((user) => {
        this._connection.setCredentials({
          uuid: user._id,
          token: user.apiToken,
        });
        return user;
      });
  }
}

function _generateCreds(username, email, password) {
  let set = [username, email, password];

  let hasBadCred = reject(set, (cred) => {
    let validString = isString(cred);
    let notEmpty = !isEmpty(cred);
    return validString && notEmpty;
  });

  if (!isEmpty(hasBadCred)) return false;

  let creds = {
    username: username,
    email: email,
    password: password,
    confirmPassword: password,
  };

  return creds;
}
