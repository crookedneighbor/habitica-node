// Content
// archive
// For all your content needs!
import get from 'lodash/get'
import keys from 'lodash/keys'
import {INTERNAL_MODULE_ERRORS as IME} from './lib/errors'

export default class {
  constructor (options) {
    this._connection = options.connection
  }

  // # content.get()
  // Gets the Habitica content object. This contains information about the items, quests, pets, etc.
  //
  // If no argument is passed in, the whole object is passed back.
  // ```js
  // // Get all content
  // api.content.get().then((content) => {
  //   content.gear.tree // all gear objects
  //   content.egg.Wolf // wolf egg object
  //   content.quests.whale // whale quest object
  // })
  // ```
  //
  // If a path is specified, only that portion of the content object is passed back.
  // ```
  // // Get specific piece of content
  // api.content.get('eggs').then((eggs) => {
  //   eggs.Wolf // wolf egg object
  // })
  //
  // // Get specific piece of nested content
  // api.content.get('gear.tree.weapon.warrior').then((warriorWeapons) => {
  //   warriorWeapons['0'] // initial warrior weapon
  // })
  // ```
  async get (path) {
    let {data: content} = await this._connection.get('content')

    if (path) {
      let nestedContent = get(content, path)

      if (nestedContent) {
        return nestedContent
      }

      throw new IME.InvalidActionError(`${path} is not a valid content path`)
    }

    return content
  }

  // # content.getKeys()
  // Gets the keys of the content object
  //
  // ```js
  // api.content.getKeys().then((keys) => {
  //   keys // an array, ['eggs', 'quests', ...]
  // })
  // ```
  //
  // If a path is specified, only the keys for that portion of the content object are passed back.
  // ```
  // api.content.getKeys('eggs').then((eggs) => {
  //   eggs // an array, ['Wolf', 'Whale', ...]
  // })
  //
  // api.content.getKeys('gear.tree.weapon.warrior').then((warriorWeapons) => {
  //   warriorWeapons // an array, ['0', '1', ...]
  // })
  // ```
  async getKeys (path) {
    let {data: content} = await this._connection.get('content')
    if (path) {
      let nestedContent = get(content, path)

      if (nestedContent) {
        return keys(nestedContent)
      }

      throw new IME.InvalidActionError(`${path} is not a valid content path`)
    }

    return keys(content)
  }

  // # content.getUserPaths()
  // Gets the content paths for a user object
  //
  // ```js
  // // Get all possible user paths
  // api.content.getUserPaths().then((paths) => {
  //   paths['achievements.beastMaster'] // Boolean
  //   paths['contributor.level'] // Number
  //   paths['items.currentPet'] // String
  //   paths['items.gear.owned.weapon_warrior_0'] // Boolean
  // })
  // ```
  async getUserPaths () {
    let {data: paths} = await this._connection.get('models/user/paths')

    return paths
  }
  // NOOP
}
