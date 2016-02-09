// User
// child
// That's you!
export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  // # get()
  //
  // Gets the entire user object.
  // ```js
  // api.user.get()
  //   .then((user) => {
  //     user._id; // your user id
  //     user.todso; // an array of your todos
  //     user.items; // your items object
  //   });
  // ```
  async get () {
    let user = await this._connection.get('user');

    return user;
  }
  // NOOP
}
