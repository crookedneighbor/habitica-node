// Chat
// comments
// We have to talk. NOTE: This module is in beta and the API may change.

import {INTERNAL_MODULE_ERRORS as IME} from './lib/errors'

export default class {
  constructor (option) {
    this._connection = option.connection
  }

  // # chat.post()
  // Create a new chat message
  //
  // Takes the group id and chat object as an argument
  //
  // ```js
  // api.chat.post('group-id', {
  //  message: 'chat message text',
  // }).then((message) => {
  //   message // the newly created chat message
  // })
  // ```
  async post (groupId, messageBody = {}) {
    if (!groupId) {
      throw new IME.MissingArgumentError('Group Id is required')
    }

    if (!messageBody.message) {
      throw new IME.MissingArgumentError('Message is a required param')
    }

    let {data} = await this._connection.post(
      `/groups/${groupId}/chat`,
      {send: messageBody}
    )

    return data.message
  }
}
