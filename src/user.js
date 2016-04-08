// User
// child
// That's you!
export default class {
  constructor (options) {
    this._connection = options.connection
  }

  // # get()
  //
  // Gets the entire user object.
  // ```js
  // api.user.get().then((user) => {
  //   user._id // your user id
  //   user.todso // an array of your todos
  //   user.items // your items object
  // })
  // ```
  async get () {
    let user = await this._connection.get('user')

    return user
  }

  // # getBuyableGear()
  //
  // Returns an array of equipment objects that can be purchased with gold. These are the gear items that appear in the rewards column on the website.
  // ```js
  // api.user.getBuyableGear().then((gear) => {
  //   gear.length // number of items returned
  //
  //   let item = gear[0] // the first item
  //
  //   item.type // 'weapon', 'shield', etc...
  //   item.value // at least 0
  //   item.str // at least 0
  //   item.con // at least 0
  //   item.int // at least 0
  //   item.per // at least 0
  // })
  // ```
  async getBuyableGear () {
    let gear = await this._connection.get('user/inventory/buy')

    return gear
  }
  // NOOP
}
