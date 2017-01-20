'use strict'

function CustomError (message) {
  /** A translated error message you can provide for your user
   * @memberof HabiticaApiError
   */
  this.message = message

  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
}

CustomError.prototype = Object.create(Error.prototype)

/**
 * @constructor HabiticaApiError
 * @description Returned when the API request returns a HTTP status between 400 and 500
 *
 * @example <caption>Use the error objects on the Habitica package to write an error handler</caption>
 * var Habitica = require('habitica')
 * var api = new Habitica({
 *   // setup client
 * })
 *
 * api.get('/user').then(() => {
 *   // will never get here
 * }).catch((err) => {
 *   if (err instanceof Habitica.ApiError) {
 *     // likely a validation error from
 *     // the API request
 *     console.log(err.message)
 *   } else if (err instanceof Habitica.UnknownConnectionError) {
 *     // either the Habitica API is down
 *     // or there is no internet connection
 *     console.log(err.originalError)
 *   } else {
 *     // there is something wrong with your integration
 *     // such as a syntax error or other problem
 *     console.log(err)
 *   }
 * })
 */
function HabiticaApiError (options) {
  options = options || {}

  CustomError.call(this, options.message)

  /** The status code of the HTTP request. Will be a number >= `400` and <= `500`
   * @memberof HabiticaApiError
   */
  this.status = options.status

  /** A type coresponding to the status code. For instance, an error with a status of `404` will be type `NotFound`
   * @memberof HabiticaApiError
   */
  this.type = options.type
  this.name = 'HabiticaApi' + options.type + 'Error'
}

HabiticaApiError.prototype = Object.create(CustomError.prototype)

/**
 * @constructor UnknownConnectionError
 *
 * @description Returned when an error could not be parsed from a failed request. Most likely when there is not an internet connection.
 * @example <caption>See {@link HabiticaApiError} for a full example of how to use it when handling request errors.</caption>
 * api.get('/user').then(() => {
 *   // assuming there is no internet
 *   // connection, so user never
 *   // gets here
 * }).catch((err) => {
 *   err.message // 'An unknown error occurred'
 *   console.error(err.originalError)
 * })
 */
function UnknownConnectionError (err) {
  CustomError.call(this, 'An unknown error occurred')

  /** The original error from the failed request
   * @memberof UnknownConnectionError
   */
  this.originalError = err
  this.name = 'UnknownConnectionError'
}

UnknownConnectionError.prototype = Object.create(HabiticaApiError.prototype)

module.exports = {
  HabiticaApiError: HabiticaApiError,
  UnknownConnectionError: UnknownConnectionError
}
