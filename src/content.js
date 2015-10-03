import {get} from 'lodash';

export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get (path) {
    return this._connection.get('content')
      .then((content) => {
        if (path) {
          let nestedContent = get(content, path);

          if (nestedContent) {
            return nestedContent;
          }

          throw `${path} is not a valid content path`;
        }

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
