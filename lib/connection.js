'use strict'

var superagent = require('superagent')
var errors = require('./errors')
var HabiticaApiError = errors.HabiticaApiError
var UnknownConnectionError = errors.UnknownConnectionError

var DEFAULT_ENDPOINT = 'https://habitica.com/'

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

  this.setCredentials(options)
}

Connection.prototype.getUuid = function () {
  return this._uuid
}

Connection.prototype.getToken = function () {
  return this._token
}

Connection.prototype.getEndpoint = function () {
  return this._endpoint
}

Connection.prototype.setCredentials = function (creds) {
  creds = creds || {}

  if (creds.hasOwnProperty('uuid')) {
    this._uuid = creds.uuid
  }
  if (creds.hasOwnProperty('token')) {
    this._token = creds.token
  }
  if (creds.hasOwnProperty('endpoint')) {
    this._endpoint = normalizeEndpoint(creds.endpoint)
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

  if (this._uuid && this._token) {
    request
      .set('x-api-user', this._uuid)
      .set('x-api-key', this._token)
  }

  request
    .query(options.query)
    .send(options.send)

  return request.then(function (response) {
    return response.body
  }).catch(function (err) {
    throw formatError(err)
  })
}

module.exports = Connection
