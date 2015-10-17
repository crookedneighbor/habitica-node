// Connection
// phone
// This is a private lib used by the other classes. It has no public interface.
import superagent from 'superagent';

export default class {
  constructor (options) {
    this._uuid = options.uuid;
    this._token = options.token;
    this._endpoint = options.endpoint || 'https://habitica.com/api/v2';

    this.delete = this.del;
  }

  getUuid () {
    return this._uuid;
  }

  getToken () {
    return this._token;
  }

  getEndpoint () {
    return this._endpoint;
  }

  setCredentials (creds={}) {
    this._uuid = creds.uuid || this._uuid;
    this._token = creds.token || this._token;
    this._endpoint = creds.endpoint || this._endpoint;
  }

  get (route, options={}) {
    return this._router('get', route, options);
  }

  post (route, options={}) {
    return this._router('post', route, options);
  }

  put (route, options={}) {
    return this._router('put', route, options);
  }

  del (route, options={}) {
    return this._router('del', route, options);
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
          if (err) {
            let errorString = JSON.parse(err.response.text).err;
            return reject({
              code: err.response.status,
              text: errorString,
            });
          }

          resolve(response.body);
        });
    });
  }
}
