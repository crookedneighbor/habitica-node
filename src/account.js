export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  register (username, email, password) {
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
