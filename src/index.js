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
// NOOP
}
