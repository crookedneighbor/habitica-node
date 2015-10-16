// Task
// checkmark box
// Get em, check em, level up!
import {filter} from 'lodash';

export default class {
  constructor (options) {
    this._connection = options.connection;
  }

  // # task.get()
  // Get your tasks.
  //
  // If no arguments are passed in, all the tasks are returned.
  //
  // ```js
  // api.task.get()
  //   .then((tasks) => {
  //     tasks[0]; // one of your tasks
  //   });
  // ```
  //
  // If you pass in a task id, it will get that specific task.
  //
  // ```js
  // api.task.get('id-of-your-task')
  //   .then((task) => {
  //     task.name; // the task name
  //     task.type; // the task type
  //   });
  // ```
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

  // # task.getDailys()
  //
  // Get all your dailys. Gives back an array of tasks.
  //
  // ```js
  // api.task.getDailys()
  //   .then((dailys) => {
  //     dailys[0]; // one of your dailys
  //   });
  // ```
  getDailys () {
    return this._filterTasksByType('daily');
  }

  // # task.getRewards()
  //
  // Get all your rewards. Gives back an array of tasks.
  //
  // ```js
  // api.task.getRewards()
  //   .then((rewards) => {
  //     rewards[0]; // one of your rewards
  //   });
  // ```
  getRewards () {
    return this._filterTasksByType('reward');
  }

  // # task.getHabits()
  //
  // Get all your habits. Gives back an array of tasks.
  //
  // ```js
  // api.task.getHabits()
  //   .then((habits) => {
  //     habits[0]; // one of your habits
  //   });
  // ```
  getHabits () {
    return this._filterTasksByType('habit');
  }

  // # task.getTodos()
  //
  // Get all your todos. Gives back an array of tasks.
  //
  // ```js
  // api.task.getTodos()
  //   .then((todos) => {
  //     todos[0]; // one of your todos
  //   });
  // ```
  getTodos () {
    return this._filterTasksByType('todo');
  }

  // # task.score()
  //
  // Scores a task.
  //
  // Takes a task id and a direction (either `'up'` or `'down'`).
  //
  // ```js
  // api.task.score(
  //  'task-id',
  //  'down',
  // ).then((stats) => {
  //   stats.delta; // Change in task value, negative number
  //   stats._tmp.drop; // If scoring the task resulted in a drop
  // });
  // ```
  //
  // Direction defaults to 'up' when not provided
  //
  // ```js
  // api.task.score('task-id')
  //   .then((stats) => {
  //     stats.delta; // Change in task value, positive number
  //   });
  // ```
  //
  // If the task id does not already exist, it will create a new habit.
  //
  // ```js
  // api.task.score(
  //  'task-id',
  //  'down',
  // ).then((stats) => {
  //   return api.task.get('task-id');
  // }).then((task) => {
  //   task.type; // 'habit'
  //   task.id; // 'task-id'
  //   task.text; // 'task-id'
  // });
  // ```
  //
  // If the task id does not already exist, you can pass in an optional body object to customize certain fields
  //
  // ```js
  // api.task.score(
  //  'task-id',
  //  'down',
  //  {
  //    type: 'todo',
  //    text: 'Custom Name',
  //    notes: 'Custom Note',
  //  },
  // ).then((stats) => {
  //   return api.task.get('task-id');
  // }).then((task) => {
  //   task.type; // 'todo'
  //   task.id; // 'task-id'
  //   task.text; // 'Custom Name'
  //   task.notes; // 'Custom Note'
  // });
  // ```
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

  // # task.post()
  // Create a new task
  //
  // Takes the task object as an argument
  //
  // ```js
  // api.task.post({
  //  text: 'task name',
  //  type: 'daily',
  //  notes: 'notes',
  // }).then((task) => {
  //   task.text; // 'task name'
  // });
  // ```
  post (taskBody) {
    return this._connection.post('user/tasks', { send: taskBody })
      .then((task) => {
        return task;
      })
      .catch((err) => {
        throw err;
      });
  }

  // # task.put()
  // Update an existing task
  //
  // Task id and task body are required arguments.
  //
  // ```js
  // api.task.put(
  //   'task-id',
  //   { text: 'new task name', notes: 'new task notes' }
  // ).then((task) => {
  //   task.text; // 'new task name'
  // });
  // ```
  put (id, taskBody) {
    if (!id) throw 'Task id is required';
    if (!taskBody) throw 'Task body is required';

    return this._connection.put(`user/tasks/${id}`, { send: taskBody })
      .then((task) => {
        return task;
      })
      .catch((err) => {
        throw err;
      });
  }

  // NOOP
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
