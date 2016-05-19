// Task
// checkmark box
// Get em, check em, level up!
import {INTERNAL_MODULE_ERRORS as IME} from './lib/errors'

export default class {
  constructor (options) {
    this._connection = options.connection

    this.delete = this.del
  }

  // # task.get()
  // Get your tasks.
  //
  // If no arguments are passed in, all the tasks are returned.
  //
  // ```js
  // api.task.get().then((tasks) => {
  //   tasks[0] // one of your tasks
  // })
  // ```
  //
  // If you pass in a task id, it will get that specific task.
  //
  // ```js
  // api.task.get('id-of-your-task').then((task) => {
  //   task.name // the task name
  //   task.type // the task type
  // })
  // ```
  async get (id) {
    let url = 'tasks'

    if (id) {
      url += `/${id}`
    } else {
      url += '/user'
    }

    let {data: tasks} = await this._connection.get(url)

    return tasks
  }

  // # task.getDailys()
  //
  // Get all your dailys. Gives back an array of tasks.
  //
  // ```js
  // api.task.getDailys().then((dailys) => {
  //   dailys[0] // one of your dailys
  // })
  // ```
  async getDailys () {
    return this._filterTasksByType('dailys')
  }

  // # task.getRewards()
  //
  // Get all your rewards. Gives back an array of tasks.
  //
  // ```js
  // api.task.getRewards().then((rewards) => {
  //   rewards[0] // one of your rewards
  // })
  // ```
  async getRewards () {
    return this._filterTasksByType('rewards')
  }

  // # task.getHabits()
  //
  // Get all your habits. Gives back an array of tasks.
  //
  // ```js
  // api.task.getHabits().then((habits) => {
  //   habits[0] // one of your habits
  // })
  // ```
  async getHabits () {
    return this._filterTasksByType('habits')
  }

  // # task.getTodos()
  //
  // Get all your todos. Gives back an array of tasks.
  //
  // ```js
  // api.task.getTodos().then((todos) => {
  //   todos[0] // one of your todos
  // })
  // ```
  async getTodos () {
    return this._filterTasksByType('todos')
  }

  // # task.score()
  //
  // Scores a task.
  //
  // Takes a task id and a direction (either `'up'` or `'down'`).
  //
  // ```js
  // api.task.score('task-id','down').then((stats) => {
  //   stats.delta // Change in task value, negative number
  //   stats._tmp.drop // If scoring the task resulted in a drop
  // })
  // ```
  //
  // Direction defaults to 'up' when not provided
  //
  // ```js
  // api.task.score('task-id').then((stats) => {
  //   stats.delta // Change in task value, positive number
  // })
  // ```
  //
  // If the task id does not already exist, it will create a new habit.
  //
  // ```js
  // api.task.score('task-id','down').then((stats) => {
  //   return api.task.get('task-id')
  // }).then((task) => {
  //   task.type // 'habit'
  //   task.id // 'task-id'
  //   task.text // 'task-id'
  // })
  // ```
  //
  // If the task id does not already exist, you can pass in an optional body object to customize certain fields
  //
  // ```js
  // api.task.score('task-id','down', {
  //  type: 'todo',
  //  text: 'Custom Name',
  //  notes: 'Custom Note'
  // }).then((stats) => {
  //   return api.task.get('task-id')
  // }).then((task) => {
  //   task.type // 'todo'
  //   task.id // 'task-id'
  //   task.text // 'Custom Name'
  //   task.notes // 'Custom Note'
  // })
  // ```
  async score (id, direction = 'up', body = {}) {
    if (!id) throw new IME.MissingArgumentError('Task id is required')

    let {data: stats} = await this._connection.post(
      `tasks/${id}/score/${direction}`,
      { send: body }
    )

    return stats
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
  //  notes: 'notes'
  // }).then((task) => {
  //   task.text // 'task name'
  // })
  // ```
  async post (taskBody) {
    let {data: task} = await this._connection.post(
      'tasks/user',
      { send: taskBody }
    )
    return task
  }

  // # task.put()
  // Update an existing task
  //
  // Task id and task body are required arguments.
  //
  // ```js
  // api.task.put('task-id', {
  //   text: 'new task name',
  //   notes: 'new task notes'
  // }).then((task) => {
  //   task.text // 'new task name'
  // })
  // ```
  async put (id, taskBody) {
    if (!id) throw new IME.MissingArgumentError('Task id is required')
    if (!taskBody) throw new IME.MissingArgumentError('Task body is required')

    let {data: task} = await this._connection.put(
      `tasks/${id}`,
      { send: taskBody }
    )

    return task
  }

  // # task.del()
  // Delete existing task.
  //
  // Task id is a required argument.
  //
  // ```js
  // api.task.del('task-id').then((task) => {
  //   task // {}
  // })
  // ```
  async del (id) {
    if (!id) throw new IME.MissingArgumentError('Task id is required')

    let {data: task} = await this._connection.del(`tasks/${id}`)

    return task
  }

  // NOOP
  async _filterTasksByType (type) {
    let {data: tasks} = await this._connection.get('tasks/user', {
      query: {type}
    })
    return tasks
  }
}
