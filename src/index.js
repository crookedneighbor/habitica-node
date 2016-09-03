// Habitica API Wrapper
// tasks
// A thin wrapper around the Habitica API
require('babel-polyfill')
import Connection from './lib/connection'

// # Habitica()
//
// Set up your instance of Habitica.
//
// The endpoint will default to https://habitica.com/ if not provided.
//
// ```js
// let Habitica = require('habitica')
// let api = new Habitica({
//   uuid: 'your-habitica.com-user-id',
//   token: 'your-habitica.com-api-token',
//   endpoint: 'http://custom-url.com'
// })
// ```
//
// The uuid and token parameters are not required and can be [set later](#setCredentials) or be set at time of [registration](#register) or [login](#login).
//
// ```js
// let Habitica = require('habitica')
// let api = new Habitica()
// ```
class Habitica {
  constructor (options = {}) {
    this._connection = new Connection({
      uuid: options.uuid,
      token: options.token,
      endpoint: options.endpoint
    })
  }

  // # getUuid()
  //
  // Gets the uuid of habitica instance.
  //
  // ```js
  // api.getUuid()
  // ```
  getUuid () {
    return this._connection.getUuid()
  }

  // # getToken()
  //
  // Gets the token of habitica instance.
  //
  // ```js
  // api.getToken()
  // ```
  getToken () {
    return this._connection.getToken()
  }

  // # getEndpoint()
  //
  // Gets the configured endpoint of habitica instance.
  //
  // ```js
  // api.getEndpoint()
  // ```
  getEndpoint () {
    return this._connection.getEndpoint()
  }

  // # setCredentials()
  //
  // Set credentials after initialization.
  //
  // If you do not provide a value, it will default to the previous value stored on initialization.
  //
  // ```js
  // api.setCredentials({
  //   uuid: 'new-user-id',
  //   token: 'new-api-token',
  //   endpoint: 'http://localhost:3000/'
  // })
  // ```
  setCredentials (creds) {
    this._connection.setCredentials(creds)
  }

  // # register()
  //
  // Registers a new account.
  //
  // The uuid and api token will be set automatically after a sucessful registration call.
  // ```js
  // api.register('username', 'email', 'password').then((res) => {
  //   let user = res.data
  // }).catch((err) => {
  //   // handle registration errors
  // })
  // ```
  async register (username, email, password) {
    let creds = {
      username,
      email,
      password,
      confirmPassword: password
    }

    let res = await this.post('/user/auth/local/register', creds)

    this.setCredentials({
      uuid: res.data._id,
      token: res.data.apiToken
    })

    return res
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
  //   let creds = res.data
  //
  //   creds.id // the user's id
  //   creds.apiToken // the user's api token
  // }).catch((err) => {
  //   // handle login errors
  // })
  // ```
  async localLogin (usernameEmail, password) {
    let loginCreds = {
      username: usernameEmail,
      password
    }
    let res = await this.post('/user/auth/local/login', loginCreds)

    this._connection.setCredentials({
      uuid: res.data.id,
      token: res.data.apiToken
    })

    return res
  }

  // # get
  //
  // Perform a GET request to Habitica's API.
  //
  // The first argument is the path. The second argument (optional) is an object that will be converted to a query string.
  //
  // ```js
  // api.get('/user').then((res) => {
  //   let user = res.data
  //
  //   user.profile.name // the user's display name
  // })
  //
  // api.get('/groups', {
  //   type: 'publicGuilds,privateGuilds'
  // }).then((res) => {
  //   let guilds = res.data
  //   let guild = guilds[0]
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
  async get (path, query) {
    return await this._connection.get(path, {
      query
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
  //   let task = res.data
  //
  //   task.text // 'Task Name'
  // })
  //
  // api.post('/groups', {
  //   type: 'party',
  //   name: 'My Party'
  // }).then((res) => {
  //   let party = res.data
  //
  //   party.name // 'My Party'
  // }).catch((err) => {
  //   // handle errors
  // })
  // ```
  async post (path, body, query) {
    return await this._connection.post(path, {
      send: body,
      query
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
  //   let task = res.data
  //
  //   task.text // 'New Task Name'
  // })
  //
  // api.put('/groups/the-group-id', {
  //   name: 'New Group Name'
  // }).then((res) => {
  //   let group = res.data
  //
  //   group.name // 'New Group Name'
  // }).catch((err) => {
  //   // handle errors
  // })
  // ```
  async put (path, body, query) {
    return await this._connection.put(path, {
      send: body,
      query
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
  async del (path, body, query) {
    return await this._connection.del(path, {
      send: body,
      query
    })
  }
  // And you're ready!
}

module.exports = Habitica
