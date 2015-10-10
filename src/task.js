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

  getDailys () {
    return this._filterTasksByType('daily');
  }

  getRewards () {
    return this._filterTasksByType('reward');
  }

  getHabits () {
    return this._filterTasksByType('habit');
  }

  getTodos () {
    return this._filterTasksByType('todo');
  }

  score (id, direction='up', body={}) {
    if (!id) throw 'Task id is required';

    return this._connection.post(`user/tasks/${id}/${direction}`, {send: body})
      .then((stats) => {
        return stats;
      })
      .catch((err) => {
        throw err;
      });
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
