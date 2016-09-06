'use strict'

var superagent = require('superagent')
var errors = require('./errors')
var HabiticaApiError = errors.HabiticaApiError
var UnknownConnectionError = errors.UnknownConnectionError

var DEFAULT_ENDPOINT = 'https://habitica.com/'
var DEFAULT_PLATFORM = 'Habitica-Node'

function formatError (err) {
  var connectionError, status, data

  if (err.response && err.response.error) {
    status = err.response.error.status
    data = JSON.parse(err.response.error.text)

    connectionError = new HabiticaApiError({
      type: data.error,
      status: status,
      message: data.message
    })
  }

  if (!connectionError) {
    connectionError = new UnknownConnectionError(err)
  }

  return connectionError
}

function normalizeEndpoint (url) {
  var lastChar = url[url.length - 1]

  if (lastChar !== '/') {
    url = url + '/'
  }

  return url
}

function Connection (options) {
  options.endpoint = options.endpoint || DEFAULT_ENDPOINT
  options.platform = options.platform || DEFAULT_PLATFORM

  this.setOptions(options)
}

Connection.prototype.getOptions = function () {
  return {
    id: this._id,
    apiToken: this._apiToken,
    endpoint: this._endpoint,
    platform: this._platform
  }
}

Connection.prototype.setOptions = function (creds) {
  creds = creds || {}

  if (creds.hasOwnProperty('id')) {
    this._id = creds.id
  }
  if (creds.hasOwnProperty('apiToken')) {
    this._apiToken = creds.apiToken
  }
  if (creds.hasOwnProperty('endpoint')) {
    this._endpoint = normalizeEndpoint(creds.endpoint)
  }
  if (creds.hasOwnProperty('platform')) {
    this._platform = creds.platform
  }
  if (creds.hasOwnProperty('errorHandler')) {
    this._errorHandler = creds.errorHandler
  }
}

Connection.prototype.get = function (route, options) {
  return this._router('get', route, options)
}

Connection.prototype.post = function (route, options) {
  return this._router('post', route, options)
}

Connection.prototype.put = function (route, options) {
  return this._router('put', route, options)
}

Connection.prototype.del = function (route, options) {
  return this._router('del', route, options)
}

Connection.prototype._router = function (method, route, options) {
  var request

  options = options || {}

  request = superagent[method](this._endpoint + 'api/v3' + route)
    .accept('application/json')
    .set('User-Agent', this._platform)
    .set('x-client', this._platform)

  if (this._id && this._apiToken) {
    request
      .set('x-api-user', this._id)
      .set('x-api-key', this._apiToken)
  }

  request
    .query(options.query)
    .send(options.send)

  return request.then(function (response) {
    return response.body
  }).catch(function (err) {
    var formattedError = formatError(err)

    if (typeof this._errorHandler === 'function') {
      return Promise.reject(this._errorHandler(formattedError))
    } else {
      throw formattedError
    }
  }.bind(this))
}

module.exports = Connection
