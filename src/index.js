import Connection from './connection';

import Account from './account';
import Content from './content';

export default class {
  constructor (options = {}) {
    if (!(options.uuid && options.token)) {
      console.warn('Missing credentials; Only content routes will be available'); // eslint-disable-line no-console
    }

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

  setCredentials (creds) {
    this._connection.setCredentials(creds);
  }
}
