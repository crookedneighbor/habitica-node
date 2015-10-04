import superagent from 'superagent';

export default class {
  constructor (options) {
    this._uuid = options.uuid;
    this._token = options.token;
    this._endpoint = options.endpoint || 'https://habitica.com/api/v2';
  }

  getUuid () {
    return this._uuid;
  }

  getToken () {
    return this._token;
  }

  setCredentials (creds={}) {
    this._uuid = creds.uuid || this._uuid;
    this._token = creds.token || this._token;
  }

  get (route, options={}) {
    return this._router('get', route, options);
  }

  post (route, options={}) {
    return this._router('post', route, options);
  }

  _router (method, route, options) {
    return new Promise((resolve, reject) => {
      let request = superagent[method](`${this._endpoint}/${route}`)
        .accept('application/json');

      if (this._uuid && this._token) {
        request
          .set('x-api-user', this._uuid)
          .set('x-api-key', this._token);
      }

      request
        .query(options.query)
        .send(options.send)
        .end((err, response) => {
          if (err) { return reject(err); }

          resolve(response.body);
        });
    });
  }
}
