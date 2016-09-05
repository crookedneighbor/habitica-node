'use strict'

function CustomError (message) {
  this.name = this.constructor.name
  this.message = message

  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
}

CustomError.prototype = Object.create(Error.prototype)

function HabiticaApiError (options) {
  options = options || {}

  CustomError.call(this, options.message)

  this.name = 'HabiticaApi' + options.type + 'Error'
  this.status = options.status
  this.type = options.type
}

HabiticaApiError.prototype = Object.create(CustomError.prototype)

function UnknownConnectionError (err) {
  CustomError.call(this, 'An unknown error occurred')

  this.name = 'UnknownConnectionError'
  this.originalError = err
}

UnknownConnectionError.prototype = Object.create(HabiticaApiError.prototype)

module.exports = {
  HabiticaApiError,
  UnknownConnectionError
}
