import superagent from 'superagent'
import { HabiticaApiError, UnknownConnectionError } from './errors'

const DEFAULT_ENDPOINT = 'https://habitica.com/'

function formatError (err) {
  let connectionError

  if (err.response && err.response.error) {
    let { status, text } = err.response.error
    let data = JSON.parse(text)
    let { error, message } = data
    connectionError = new HabiticaApiError({
      type: error,
      status,
      message
    })
  }

  if (!connectionError) {
    connectionError = new UnknownConnectionError(err)
  }

  return connectionError
}

function normalizeEndpoint (url) {
  let lastChar = url[url.length - 1]

  if (lastChar !== '/') {
    url = url + '/'
  }

  return url
}

class Connection {
  constructor (options) {
    options.endpoint = options.endpoint || DEFAULT_ENDPOINT

    this.setCredentials(options)
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
    if (creds.hasOwnProperty('uuid')) {
      this._uuid = creds.uuid
    }
    if (creds.hasOwnProperty('token')) {
      this._token = creds.token
    }
    if (creds.hasOwnProperty('endpoint')) {
      let endpoint = normalizeEndpoint(creds.endpoint)
      this._endpoint = endpoint
    }
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
    let request = superagent[method](`${this._endpoint}api/v3${route}`)
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
