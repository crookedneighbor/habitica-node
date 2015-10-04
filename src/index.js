import Connection from './connection';

import Account from './account';
import Content from './content';

export default class {
  constructor (options = {}) {
    this._connection = new Connection({
      uuid: options.uuid,
      token: options.token,
      endpoint: options.endpoint,
    });

    this.account = new Account({
      connection: this._connection,
    });

    this.content = new Content({
      connection: this._connection,
    });
  }

  getUuid () {
    return this._connection.getUuid();
  }

  getToken () {
    return this._connection.getToken();
  }

  getEndpoint () {
    return this._connection.getEndpoint();
  }

  setCredentials (creds) {
    this._connection.setCredentials(creds);
  }
}
