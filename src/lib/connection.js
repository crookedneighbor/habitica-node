import superagent from 'superagent'
import { HabiticaApiError, UnknownConnectionError } from './errors'

const CRED_KEYS = Object.freeze([
  'uuid',
  'token',
  'endpoint'
])

function formatError (err) {
  let connectionError

  if (err.response && err.response.error) {
    let { status, text } = err.response.error
    let data = JSON.parse(text)
    let { error, message } = data
    connectionError = new HabiticaApiError({
      type: error,
      status,
      message,
    })
  }

  if (!connectionError) {
    connectionError = new UnknownConnectionError(err)
  }

  return connectionError
}

class Connection {
  constructor (options) {
    this._uuid = options.uuid
    this._token = options.token
    this._endpoint = options.endpoint || 'https://habitica.com/api/v3'

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
    CRED_KEYS.forEach((key) => {
      if (creds.hasOwnProperty(key)) {
        this[`_${key}`] = creds[key]
      }
    })
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

  async _router (method, route, options) {
    let request = superagent[method](`${this._endpoint}/${route}`)
      .accept('application/json')

    if (this._uuid && this._token) {
      request
        .set('x-api-user', this._uuid)
        .set('x-api-key', this._token)
    }

    try {
      let response = await request
        .query(options.query)
        .send(options.send)

      return response.body
    } catch (err) {
      let connectionError = formatError(err)

      throw connectionError
    }
  }
}

module.exports = Connection
