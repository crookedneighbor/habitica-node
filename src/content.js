export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get () {
    return this._connection.get('content')
      .then((content) => {
        return content;
      });
  }

  getEggs () {
    return this._connection.get('content')
      .then((content) => {
        return content.eggs;
      });
  }

  getGearTree () {
    return this._connection.get('content')
      .then((content) => {
        return content.gear.tree;
      });
  }

  getGearFlat () {
    return this._connection.get('content')
      .then((content) => {
        return content.gear.flat;
      });
  }

  getQuests () {
    return this._connection.get('content')
      .then((content) => {
        return content.quests;
      });
  }

  getPaths () {
    return this._connection.get('content/paths')
      .then((paths) => {
        return paths;
      });
  }
}
