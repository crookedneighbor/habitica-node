export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get () {
    return this._connection.get('content')
      .then((content) => {
        return content;
      });
  }

  getPaths () {
    return this._connection.get('content/paths')
      .then((paths) => {
        return paths;
      });
  }
}

