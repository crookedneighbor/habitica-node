// Tag
// tags
// Sort thy stuff!

import {INTERNAL_MODULE_ERRORS as IME} from './lib/errors'

export default class {
  constructor (option) {
    this._connection = option.connection

    this.delete = this.del
  }

  // # tag.get()
  // Get your tags.
  //
  // If no arguments are passed in, all the tags are returned.
  //
  // ```js
  // api.tag.get()
  //   .then((tags) => {
  //     tags[0] // one of your tags
  //   })
  // ```
  //
  // If you pass in a tag id, it will get that specific tag.
  //
  // ```js
  // api.tag.get('id-of-your-tag')
  //   .then((tag) => {
  //     tag.name // the tag name
  //     tag.id // the tag id
  //   })
  // ```
  async get (id) {
    let url = 'user/tags'

    if (id) {
      url += `/${id}`
    }

    let tags = await this._connection.get(url)

    return tags
  }

  // # tag.post()
  // Create a new tag
  //
  // Takes the tag object as an argument
  //
  // ```js
  // api.tag.post({
  //  name: 'tag name',
  // }).then((tags) => {
  //   tags // it returns all of the existing tags
  // })
  // ```
  async post (tagBody) {
    let tags = await this._connection.post(
      'user/tags',
      {send: tagBody}
    )

    return tags
  }

  // # tag.put()
  // Update an existing tag
  //
  // Tag id and tag body are required arguments.
  //
  // ```js
  // api.tag.put(
  //   'tag-id',
  //   { name: 'new tag name' }
  // ).then((tag) => {
  //   tag.name // 'new tag name'
  // })
  // ```
  async put (id, tagBody) {
    if (!id) throw new IME.MissingArgumentError('Tag id is required')
    if (!tagBody) throw new IME.MissingArgumentError('Tag body is required')

    let tag = await this._connection.put(
      `user/tags/${id}`,
      { send: tagBody }
    )

    return tag
  }

  // # tag.del()
  // Delete existing tag.
  //
  // Tag id is a required argument.
  //
  // ```js
  // api.tag.del(
  //   'tag-id',
  // ).then((tags) => {
  //   tags // remaining existing tags
  // })
  // ```
  async del (id) {
    if (!id) throw new IME.MissingArgumentError('Tag id is required')

    let remainingTags = await this._connection.del(`user/tags/${id}`)

    return remainingTags
  }
}
