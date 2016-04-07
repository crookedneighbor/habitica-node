// Account
// settings
// Manage your account
import {INTERNAL_MODULE_ERRORS as IME} from './lib/errors'

export default class {
  constructor (options) {
    this._connection = options.connection
  }

  // # account.register()
  //
  // Registers a new account.
  //
  // The uuid and api token will be set automatically after a sucessful registration call.
  // ```js
  // api.account.register(
  //   'username',
  //   'email',
  //   'password',
  // )
  // ```
  //
  // If the uuid or api token are already set, the register call will throw an error. You can override this behavior by passing in an object with a `resetOldCreds` parameter set to true
  //
  // ```js
  // api.account.register(
  //   'username',
  //   'email',
  //   'password',
  //   { resetOldCreds: true },
  // )
  // ```
  async register (username, email, password, options = {}) {
    if (this._connection._uuid || this._connection._token) {
      if (!options.resetOldCreds) {
        throw new IME.InvalidActionError('User id or api token already set')
      }

      this._connection.setCredentials({uuid: null, token: null})
    }

    let creds = {
      username,
      email,
      password,
      confirmPassword: password
    }

    let user = await this._connection.post(
        'register',
        {send: creds}
      )

    this._connection.setCredentials({
      uuid: user._id,
      token: user.apiToken
    })

    return user
  }

  // # account.login()
  //
  // Logs into an existing account.
  //
  // You can log in with your username and password or your email and password.
  //
  // The uuid and api token will be set automatically after a sucessful login call.
  //
  // ```js
  // api.account.login(
  //   'username or email',
  //   'password',
  // )
  // ```
  async login (username_email, password, options = {}) {
    let loginCreds = {
      username: username_email,
      password
    }
    let creds = await this._connection.post(
      'user/auth/local',
      {send: loginCreds}
    )

    this._connection.setCredentials({
      uuid: creds.id,
      token: creds.token
    })

    return creds
  }
// NOOP
}
