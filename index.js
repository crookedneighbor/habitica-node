// Habitica API Wrapper
// tasks
// A thin wrapper around the Habitica API
require('es6-promise').polyfill()
var Connection = require('./lib/connection')
var errors = require('./lib/errors')

// # Habitica()
// Set up your instance of Habitica.
//
// The endpoint will default to https://habitica.com/ if not provided.
//
// ```js
// var Habitica = require('habitica')
// var api = new Habitica({
//   uuid: 'your-habitica.com-user-id',
//   token: 'your-habitica.com-api-token',
//   endpoint: 'http://custom-url.com'
// })
// ```
//
// The uuid and token parameters are not required and can be [set later](#setOptions) or be set at time of [registration](#register) or [login](#login).
//
// ```js
// var Habitica = require('habitica')
// var api = new Habitica()
// ```
function Habitica (options) {
  options = options || {}

  this._connection = new Connection(options)
}

// # getUuid()
//
// Gets the uuid of habitica instance.
//
// ```js
// api.getUuid()
// ```
Habitica.prototype.getUuid = function () {
  return this._connection.getUuid()
}

// # getToken()
//
// Gets the token of habitica instance.
//
// ```js
// api.getToken()
// ```
Habitica.prototype.getToken = function () {
  return this._connection.getToken()
}

// # getEndpoint()
//
// Gets the configured endpoint of habitica instance.
//
// ```js
// api.getEndpoint()
// ```
Habitica.prototype.getEndpoint = function () {
  return this._connection.getEndpoint()
}

// # setOptions()
//
// Set credentials after initialization.
//
// If you do not provide a value, it will default to the previous value stored on initialization.
//
// ```js
// api.setOptions({
//   uuid: 'new-user-id',
//   token: 'new-api-token',
//   endpoint: 'http://localhost:3000/'
// })
// ```
Habitica.prototype.setOptions = function (creds) {
  this._connection.setOptions(creds)
}

// # register()
//
// Registers a new account.
//
// The uuid and api token will be set automatically after a sucessful registration call.
// ```js
// api.register('username', 'email', 'password').then((res) => {
//   var user = res.data
// }).catch((err) => {
//   // handle registration errors
// })
// ```
Habitica.prototype.register = function (username, email, password) {
  return this.post('/user/auth/local/register', {
    username: username,
    email: email,
    password: password,
    confirmPassword: password
  }).then(function (res) {
    this.setOptions({
      uuid: res.data._id,
      token: res.data.apiToken
    })

    return res
  }.bind(this))
}

// # localLogin()
//
// Logs into an existing account.
//
// You can log in with your username and password or your email and password.
//
// The uuid and api token will be set automatically after a sucessful login call.
//
// ```js
// api.login('username or email','password').then((res) => {
//   var creds = res.data
//
//   creds.id // the user's id
//   creds.apiToken // the user's api token
// }).catch((err) => {
//   // handle login errors
// })
// ```
Habitica.prototype.localLogin = function (usernameEmail, password) {
  return this.post('/user/auth/local/login', {
    username: usernameEmail,
    password
  }).then(function (res) {
    this._connection.setOptions({
      uuid: res.data.id,
      token: res.data.apiToken
    })

    return res
  }.bind(this))
}

// # get
//
// Perform a GET request to Habitica's API.
//
// The first argument is the path. The second argument (optional) is an object that will be converted to a query string.
//
// ```js
// api.get('/user').then((res) => {
//   var user = res.data
//
//   user.profile.name // the user's display name
// })
//
// api.get('/groups', {
//   type: 'publicGuilds,privateGuilds'
// }).then((res) => {
//   var guilds = res.data
//   var guild = guilds[0]
//
//   guild.name // the name of the group
// })
//
// // error handling
// api.get('/tasks/non-existant-id').then((res) => {
//   // will never get here
// }).catch((err) => {
//   // handle task not found error
//   err.message // 'Task not found'
// })
// ```
Habitica.prototype.get = function (path, query) {
  return this._connection.get(path, {
    query: query
  })
}

// # post
//
// Perform a POST request to Habitica's API.
//
// The first argument is the path. The second argument (optional) is an object that will be sent as the body of the POST request. The thrid argument (optional) is an object that will be converted to a query string.
//
// ```js
// api.post('/tasks/user', {
//   text: 'Task Name',
//   notes: 'Task Notes',
//   type: 'todo'
// }).then((res) => {
//   var task = res.data
//
//   task.text // 'Task Name'
// })
//
// api.post('/groups', {
//   type: 'party',
//   name: 'My Party'
// }).then((res) => {
//   var party = res.data
//
//   party.name // 'My Party'
// }).catch((err) => {
//   // handle errors
// })
// ```
Habitica.prototype.post = function (path, body, query) {
  return this._connection.post(path, {
    send: body,
    query: query
  })
}

// # put
//
// Perform a PUT request to Habitica's API.
//
// The first argument is the path. The second argument (optional) is an object that will be sent as the body of the PUT request. The thrid argument (optional) is an object that will be converted to a query string.
//
// ```js
// api.put('/tasks/the-task-id', {
//   text: 'New Task Name',
//   notes: 'New Text Notes'
// }).then((res) => {
//   var task = res.data
//
//   task.text // 'New Task Name'
// })
//
// api.put('/groups/the-group-id', {
//   name: 'New Group Name'
// }).then((res) => {
//   var group = res.data
//
//   group.name // 'New Group Name'
// }).catch((err) => {
//   // handle errors
// })
// ```
Habitica.prototype.put = function (path, body, query) {
  return this._connection.put(path, {
    send: body,
    query: query
  })
}

// # del
//
// Perform a DELETE request to Habitica's API.
//
// The first argument is the path. The second argument (optional) is an object that will be sent as the body of the DELETE request. The thrid argument (optional) is an object that will be converted to a query string.
//
// ```js
// api.del('/tasks/the-task-id').then(() => {
//   // The task has been deleted
// })
//
// api.del('/groups/the-group-id').then(() => {
//  // The group has been deleted
// }).catch((err) => {
//   // handle errors
// })
// ```
Habitica.prototype.del = function (path, body, query) {
  return this._connection.del(path, {
    send: body,
    query: query
  })
}

// And you're ready!
Habitica.ApiError = errors.HabiticaApiError
Habitica.UnknownConnectionError = errors.UnknownConnectionError
module.exports = Habitica
