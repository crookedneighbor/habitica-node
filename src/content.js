// Content
// archive
// For all your content needs!
import {get} from 'lodash';

export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  // # content.get()
  // Gets the Habitica content object. This contains information about the items, quests, pets, etc.
  //
  // If no argument is passed in, the whole object is passed back.
  // ```js
  // // Get all content
  // api.content.get()
  //   .then((content) => {
  //     content.gear.tree; // all gear objects
  //     content.egg.Wolf; // wolf egg object
  //     content.quests.whale; // whale quest object
  //   });
  // ```
  //
  // If a path is specified, only that portion of the content object is passed back.
  // ```
  // // Get specific piece of content
  // api.content.get('eggs')
  //   .then((eggs) => {
  //     eggs.Wolf; // wolf egg object
  //   });
  //
  // // Get specific piece of nested content
  // api.content.get('gear.tree.weapon.warrior')
  //   .then((warriorWeapons) => {
  //     warriorWeapons['0']; // initial warrior weapon
  //   });
  // ```
  get (path) {
    return this._connection.get('content')
      .then((content) => {
        if (path) {
          let nestedContent = get(content, path);

          if (nestedContent) {
            return nestedContent;
          }

          throw `${path} is not a valid content path`;
        }

        return content;
      });
  }

  // # content.getUserPaths()
  // Gets the content paths for a user object
  // ```js
  // // Get all possible user paths
  // api.content.getUserPaths()
  //   .then((paths) => {
  //     paths['achievements.beastMaster']; // Boolean
  //     paths['contributor.level']; // Number
  //     paths['items.currentPet']; // String
  //     paths['items.gear.owned.weapon_warrior_0']; // Boolean
  //   });
  // ```
  getUserPaths () {
    return this._connection.get('content/paths')
      .then((paths) => {
        return paths;
      });
  }
  // NOOP
}
