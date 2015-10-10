import {filter} from 'lodash';

export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  get (id) {
    let url = 'user/tasks';

    if (id) {
      url += `/${id}`;
    }

    return this._connection.get(url)
      .then((tasks) => {
        return tasks;
      })
      .catch((err) => {
        throw err;
      });
  }

  getTodos () {
    return this._filterTasksByType('todo');
  }

  getHabits () {
    return this._filterTasksByType('habit');
  }

  getDailys () {
    return this._filterTasksByType('daily');
  }

  getRewards () {
    return this._filterTasksByType('reward');
  }

  _filterTasksByType (type) {
    return this._connection.get('user/tasks')
      .then((tasks) => {
        let taskByType = filter(tasks, (task) => {
          return task.type === type;
        });
        return taskByType;
      })
      .catch((err) => {
        throw err;
      });
  }
}
