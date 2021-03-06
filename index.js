'use strict'

var Connection = require('./lib/connection')
var errors = require('./lib/errors')

if (!global.Promise) {
  throw new Error('Promise could not be found in this context. You must polyfill it to use this module.')
}

/**
 * @constructor
 * @description Your client to interact with the [Habitica API](https://habitica.com/apidoc/).
 *
 * @param {Object} options - The properties to configure the Habitica client
 * @param {String} [options.id] - The id of the user
 * @param {String} [options.apiToken] - The API token of the user
 * @param {String} [options.endpoint=https://habitica.com] - The endpoint to use
 * @param {String} [options.platform=Habitica-Node] - The name of your integration
 * @param {Function} [options.errorHandler] - A function to run when a request errors. The result of this function will be the argument passed to the `catch` in the request `Promise`
 *
 * @example
 * var Habitica = require('habitica')
 * var api = new Habitica({
 *   id: 'your-habitica.com-user-id',
 *   apiToken: 'your-habitica.com-api-token',
 *   endpoint: 'http://custom-url.com',
 *   platform: 'The Name of Your Integration'
 *   errorHandler: function (err) {
 *     // handle all errors from failed requests
 *   }
 * })
 * @example <caption>The id and apiToken parameters are not required and can be set later. The credentials will be automatically set when using the register and localLogin methods.</caption>
 * var Habitica = require('habitica')
 * var api = new Habitica()
 * @example <caption>A sample error handler</caption>
 * var Habitica = require('habitica')
 *
 * function sendNotification (style, message) {
 *   // logic for sending a notification to user
 * }
 *
 * var api = new Habitica({
 *   id: 'your-habitica.com-user-id',
 *   apiToken: 'your-habitica.com-api-token',
 *   errorHandler: function (err) {
 *     if (err instanceof Habitica.ApiError) {
 *       // likely a validation error from
 *       // the API request
 *       sendNotification('warning', err.messsage)
 *     } else if (err instanceof Habitica.UnknownConnectionError) {
 *       // either the Habitica API is down
 *       // or there is no internet connection
 *       sendNotification('danger', err.originalError.message)
 *     } else {
 *       // there is something wrong with your integration
 *       // such as a syntax error or other problem
 *       console.error(err)
 *     }
 *   }
 * })
 *
 * api.get('/tasks/id-that-does-not-exist').then(() => {
 *   // will never get here
 *   return api.get('/something-else')
 * }).then(() => {
 *   // will never get here
 * }).catch((err) => {
 *   // before this happens, the errorHandler gets run
 *   err // undefined because the errorHandler did not return anything
 *   // you could leave the catch off entirely since the
 *   // configured errorHandler does all the necessary work
 *   // to message back to the user
 * })
 */
function Habitica (options) {
  options = options || {}

  this._connection = new Connection(options)
}

/** @public
 *
 * @returns {Object} The options used to make the requests. The same as the values used {@link Habitica#setOptions|to set the options}
 */
Habitica.prototype.getOptions = function () {
  return this._connection.getOptions()
}

/** @public
 *
 * @param {Object} options - The properties to configure the Habitica client. If a property is not passed in, it will default to the value passed in on instantiation
 * @param {String} [options.id] - The id of the user
 * @param {String} [options.apiToken] - The API apiToken of the user
 * @param {String} [options.endpoint] - The endpoint to use
 * @param {String} [options.platform] - The name of your integration
 * @param {Function} [options.errorHandler] - A function to run when a request errors
 *
 * @example
 * api.setOptions({
 *   id: 'new-user-id',
 *   apiToken: 'new-api-token',
 *   endpoint: 'http://localhost:3000/',
 *   platform: 'Great-Habitica-Integration',
 *   errorHandler: yourErrorHandlerFunction
 * })
 */
Habitica.prototype.setOptions = function (creds) {
  this._connection.setOptions(creds)
}

/** @public
 *
 * @param {String} username - The username to register with
 * @param {String} email - The email to register with
 * @param {String} password - The password to register with
 *
 * @returns {Promise} A Promise that resolves the response from the register request
 *
 * @example <caption>The id and api token will be set automatically after a sucessful registration request</caption>
 * api.register('username', 'email', 'password').then((res) => {
 *   var user = res.data
 * }).catch((err) => {
 *   // handle registration errors
 * })
 */
Habitica.prototype.register = function (username, email, password) {
  return this.post('/user/auth/local/register', {
    username: username,
    email: email,
    password: password,
    confirmPassword: password
  }).then(function (res) {
    this.setOptions({
      id: res.data._id,
      apiToken: res.data.apiToken
    })

    return res
  }.bind(this))
}

/** @public
 *
 * @param {String} usernameOrEmail - The username or email to login with
 * @param {String} password - The password to login with
 *
 * @returns {Promise} A Promise that resolves the response from the login request
 * @example <caption>The id and api token will be set automatically after a sucessful login request</caption>
 * api.login('username or email','password').then((res) => {
 *   var creds = res.data
 *
 *   creds.id // the user's id
 *   creds.apiToken // the user's api token
 * }).catch((err) => {
 *   // handle login errors
 * })
 */
Habitica.prototype.localLogin = function (usernameEmail, password) {
  return this.post('/user/auth/local/login', {
    username: usernameEmail,
    password: password
  }).then(function (res) {
    this._connection.setOptions({
      id: res.data.id,
      apiToken: res.data.apiToken
    })

    return res
  }.bind(this))
}

/** @public
 *
 * @param {String} route - The Habitica API route to use
 * @param {Object} [query] - Query params to send along with the request
 *
 * @returns {Promise} A Promise that resolves the response from the GET request
 * @example <caption>Making a basic request</caption>
 * api.get('/user').then((res) => {
 *   var user = res.data
 *
 *   user.profile.name // the user's display name
 * })
 * @example <caption>A request with a query Object</caption>
 * api.get('/groups', {
 *   type: 'publicGuilds,privateGuilds'
 * }).then((res) => {
 *   var guilds = res.data
 *   var guild = guilds[0]
 *
 *   guild.name // the name of the group
 * })
 *
 * @example <caption>Handling errors</caption>
 * api.get('/tasks/non-existant-id').then((res) => {
 *   // will never get here
 * }).catch((err) => {
 *   err.message // 'Task not found'
 * })
 */
Habitica.prototype.get = function (path, query) {
  return this._connection.get(path, {
    query: query
  })
}

/** @public
 *
 * @param {String} route - The Habitica API route to use
 * @param {Object} [body] - The body to send along with the request
 * @param {Object} [query] - Query params to send along with the request
 *
 * @returns {Promise} A Promise that resolves the response from the POST request
 *
 * @example <caption>A request with a body</caption>
 * api.post('/tasks/user', {
 *   text: 'Task Name',
 *   notes: 'Task Notes',
 *   type: 'todo'
 * }).then((res) => {
 *   var task = res.data
 *
 *   task.text // 'Task Name'
 * })
 *
 * @example <caption>Handling errors</caption>
 * api.post('/groups', {
 *   type: 'party',
 *   name: 'My Party'
 * }).then((res) => {
 *   var party = res.data
 *
 *   party.name // 'My Party'
 * }).catch((err) => {
 *   // handle errors
 * })
 */
Habitica.prototype.post = function (path, body, query) {
  return this._connection.post(path, {
    send: body,
    query: query
  })
}

/** @public
 *
 * @param {String} route - The Habitica API route to use
 * @param {Object} [body] - The body to send along with the request
 * @param {Object} [query] - Query params to send along with the request
 *
 * @returns {Promise} A Promise that resolves the response from the PUT request
 *
 * @example <caption>A request with a body</caption>
 * api.put('/tasks/the-task-id', {
 *   text: 'New Task Name',
 *   notes: 'New Text Notes'
 * }).then((res) => {
 *   var task = res.data
 *
 *   task.text // 'New Task Name'
 * })
 *
 * @example <caption>Handling errors</caption>
 * api.put('/groups/the-group-id', {
 *   name: 'New Group Name'
 * }).then((res) => {
 *   var group = res.data
 *
 *   group.name // 'New Group Name'
 * }).catch((err) => {
 *   // handle errors
 * })
 */
Habitica.prototype.put = function (path, body, query) {
  return this._connection.put(path, {
    send: body,
    query: query
  })
}

/** @public
 *
 * @param {String} route - The Habitica API route to use
 * @param {Object} [body] - The body to send along with the request
 * @param {Object} [query] - Query params to send along with the request
 *
 * @returns {Promise} A Promise that resolves the response from the DELETE request
 *
 * @example <caption>A basic request</caption>
 * api.del('/tasks/the-task-id').then(() => {
 *   // The task has been deleted
 * })
 *
 * @example <caption>Handling errors</caption>
 * api.del('/groups/the-group-id').then(() => {
 *  // The group has been deleted
 * }).catch((err) => {
 *   // handle errors
 * })
 */
Habitica.prototype.del = function (path, body, query) {
  return this._connection.del(path, {
    send: body,
    query: query
  })
}

Habitica.ApiError = errors.HabiticaApiError
Habitica.UnknownConnectionError = errors.UnknownConnectionError

module.exports = Habitica
