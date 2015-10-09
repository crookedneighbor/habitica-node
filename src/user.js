export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get () {
    return this._connection.get('user')
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }
}
