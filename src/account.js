export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  register (username, email, password) {
    if (this._connection._uuid || this._connection._token) {
      throw 'User id or api token already set';
    }

    let send = {
      username: username,
      email: email,
      password: password,
      confirmPassword: password,
    };

    return this._connection.post('register', {send: send})
      .then((user) => {
        this._connection.setCredentials({
          uuid: user._id,
          token: user.apiToken,
        });
        return user;
      });
  }
}
