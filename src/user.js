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
  // user.get()
  //   .then((user) => {
  //     user._id; // your user id
  //     user.todso; // an array of your todos
  //     user.items; // your items object
  //   });
  // ```
  get () {
    return this._connection.get('user')
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }
  // NOOP
}
