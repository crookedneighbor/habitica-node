import superagent from 'superagent';

export default class {
  constructor (options) {
    this._uuid = options.uuid;
    this._token = options.token;
    this._endpoint = options.endpoint || 'https://habitica.com/api/v2';
  }

  setCredentials (creds={}) {
    this._uuid = creds.uuid || this._uuid;
    this._token = creds.token || this._token;
  }

  get (route, query={}) {
    return this._router('get', route, query);
  }

  post (route, query={}) {
    return this._router('post', route, query);
  }

  _router (method, route, query) {
    return new Promise((resolve, reject) => {
      let request = superagent
        [method](`${this._endpoint}/${route}`)
        .query(query);

      if (this._uuid && this._token) {
        request
          .set('x-api-user', this._uuid)
          .set('x-api-key', this._token);
      }

      request
        .set('Accept', 'application/json')
        .end((err, response) => {
          if (err) { return reject(err); }

          resolve(response.body);
        });
    });
  }
}
