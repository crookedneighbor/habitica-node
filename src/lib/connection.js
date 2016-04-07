// Connection
// phone
// This is a private lib used by the other classes. It has no public interface.
import superagent from 'superagent'
import Q from 'q'
import {API_ERRORS} from './errors'

export default class {
  constructor (options) {
    this._uuid = options.uuid
    this._token = options.token
    this._endpoint = options.endpoint || 'https://habitica.com/api/v2'

    this.delete = this.del
  }

  getUuid () {
    return this._uuid
  }

  getToken () {
    return this._token
  }

  getEndpoint () {
    return this._endpoint
  }

  setCredentials (creds = {}) {
    this._uuid = creds.uuid || this._uuid
    this._token = creds.token || this._token
    this._endpoint = creds.endpoint || this._endpoint
  }

  get (route, options = {}) {
    return this._router('get', route, options)
  }

  post (route, options = {}) {
    return this._router('post', route, options)
  }

  put (route, options = {}) {
    return this._router('put', route, options)
  }

  del (route, options = {}) {
    return this._router('del', route, options)
  }

  _router (method, route, options) {
    return Q.Promise((resolve, reject) => { // eslint-disable-line new-cap
      let request = superagent[method](`${this._endpoint}/${route}`)
        .accept('application/json')

      if (this._uuid && this._token) {
        request
          .set('x-api-user', this._uuid)
          .set('x-api-key', this._token)
      }

      request
        .query(options.query)
        .send(options.send)
        .end((err, response) => {
          if (err) {
            let connectionError = this._formatError(err)
            return reject(connectionError)
          }

          resolve(response.body)
        })
    })
  }

  _formatError (err) {
    let connectionError

    if (err.response) {
      let HttpError = API_ERRORS[err.response.status]
      if (HttpError) {
        connectionError = new HttpError(err.response.body.err)
      }
    }

    if (!connectionError) {
      connectionError = new API_ERRORS.UNKNOWN(err)
    }

    return connectionError
  }
}
