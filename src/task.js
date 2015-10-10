export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get (id) {
    let url = 'user/tasks';

    if (id) {
      url += `/${id}`;
    }

    return this._connection.get(url)
      .then((tasks) => {
        return tasks;
      })
      .catch((err) => {
        throw err;
      });
  }
}

