// Initialize
// heartbeat
// Set up your client!
require('babel-polyfill')
import Connection from './lib/connection'

import Account from './account'
import Chat from './chat'
import Content from './content'
import Task from './task'
import User from './user'
import Tag from './tag'

module.exports = class {
  constructor (options = {}) {
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
    // The uuid and token parameters are not required and can be [set later](#setCredentials) or be set at time of [registration](account.html#account.register) or [login](account.html#account.login).
    //
    // ```js
    // let Habitica = require('habitica')
    // let api = new Habitica()
    // ```
    this._connection = new Connection({
      uuid: options.uuid,
      token: options.token,
      endpoint: options.endpoint
    })

    // NOOP
    let modules = {
      account: Account,
      chat: Chat,
      content: Content,
      tag: Tag,
      task: Task,
      user: User
    }

    Object.keys(modules).forEach((module) => {
      this[module] = new modules[module]({
        connection: this._connection
      })
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
  //   notes: 'Text Notes'
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
  // })
  // ```
  async del (path, body, query) {
    return await this._connection.del(path, {
      send: body,
      query
    })
  }
  //NOOP
}
