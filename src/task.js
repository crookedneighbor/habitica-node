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
    return this._connection.get('user/tasks')
      .then((tasks) => {
        let todos = filter(tasks, (task) => {
          return task.type === 'todo';
        });
        return todos;
      })
      .catch((err) => {
        throw err;
      });
  }

  getHabits () {
    return this._connection.get('user/tasks')
      .then((tasks) => {
        let habits = filter(tasks, (task) => {
          return task.type === 'habit';
        });
        return habits;
      })
      .catch((err) => {
        throw err;
      });
  }

  getDailys () {
    return this._connection.get('user/tasks')
      .then((tasks) => {
        let dailys = filter(tasks, (task) => {
          return task.type === 'daily';
        });
        return dailys;
      })
      .catch((err) => {
        throw err;
      });
  }

  getRewards () {
    return this._connection.get('user/tasks')
      .then((tasks) => {
        let rewards = filter(tasks, (task) => {
          return task.type === 'reward';
        });
        return rewards;
      })
      .catch((err) => {
        throw err;
      });
  }
}
