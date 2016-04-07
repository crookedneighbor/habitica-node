import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors'

describe('Task', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v2`
  })

  beforeEach(async function () {
    let update = {
      'todos': [
        {type: 'todo', id: 'todo-1'},
        {type: 'todo', id: 'todo-2'}
      ],
      'habits': [
        {type: 'habit', id: 'habit-1'},
        {type: 'habit', id: 'habit-2'}
      ],
      'dailys': [
        {type: 'daily', id: 'daily-1'},
        {type: 'daily', id: 'daily-2'}
      ],
      'rewards': [
        {type: 'reward', id: 'reward-1'},
        {type: 'reward', id: 'reward-2'}
      ]
    }
    await generateUser(update, api)
  })

  describe('#get', () => {
    it('gets all tasks', async function () {
      let tasks = await api.task.get()

      expect(tasks).to.have.a.lengthOf(8)
    })

    it('gets a specific task by id', async function () {
      let task = await api.task.get('todo-1')

      expect(task.id).to.eql('todo-1')
    })

    it('throws error if task does not exist', async function () {
      await expect(api.task.get('todo-that-does-not-exist'))
        .to.eventually.be.rejected
    })
  })

  describe('#getDailys', () => {
    it('gets only dailys', async function () {
      let dailys = await api.task.getDailys()

      expect(dailys).to.have.a.lengthOf(2)
      expect(dailys[0].type).to.eql('daily')
      expect(dailys[1].type).to.eql('daily')
    })
  })

  describe('#getHabits', () => {
    it('gets only habits', async function () {
      let habits = await api.task.getHabits()

      expect(habits).to.have.a.lengthOf(2)
      expect(habits[0].type).to.eql('habit')
      expect(habits[1].type).to.eql('habit')
    })
  })

  describe('#getRewards', () => {
    it('gets only rewards', async function () {
      let rewards = await api.task.getRewards()

      expect(rewards).to.have.a.lengthOf(2)
      expect(rewards[0].type).to.eql('reward')
      expect(rewards[1].type).to.eql('reward')
    })
  })

  describe('#getTodos', () => {
    it('gets only todos', async function () {
      let todos = await api.task.getTodos()
      expect(todos).to.have.a.lengthOf(2)
      expect(todos[0].type).to.eql('todo')
      expect(todos[1].type).to.eql('todo')
    })
  })

  describe('#score', () => {
    it('scores up a task', async function () {
      let { value: originalValue } = await api.task.get('habit-1')
      let stats = await api.task.score('habit-1', 'up')
      let { value: newValue } = await api.task.get('habit-1')

      expect(stats.delta).to.be.greaterThan(0)
      expect(newValue).to.be.greaterThan(originalValue)
    })

    it('scores down a task', async function () {
      let { value: originalValue } = await api.task.get('habit-1')
      let stats = await api.task.score('habit-1', 'down')
      let { value: newValue } = await api.task.get('habit-1')

      expect(stats.delta).to.be.lessThan(0)
      expect(newValue).to.be.lessThan(originalValue)
    })

    it('defaults to scoring up', async function () {
      let { value: originalValue } = await api.task.get('habit-1')
      let stats = await api.task.score('habit-1')
      let { value: newValue } = await api.task.get('habit-1')

      expect(stats.delta).to.be.greaterThan(0)
      expect(newValue).to.be.greaterThan(originalValue)
    })

    it('creates new habit if it does not already exist', async function () {
      await api.task.score('new-habit')
      let habit = await api.task.get('new-habit')

      expect(habit.type).to.eql('habit')
    })

    it('allows extra data to be passed in when creating the task', async function () {
      let todoBody = {
        type: 'todo',
        text: 'Custom Name',
        notes: 'Custom Note'
      }
      await api.task.score('new-todo', 'up', todoBody)

      let todo = await api.task.get('new-todo')

      expect(todo.type).to.eql('todo')
      expect(todo.text).to.eql('Custom Name')
      expect(todo.notes).to.eql('Custom Note')
    })

    it('completes task if scored task is a todo', async function () {
      await api.task.score('todo-1')
      let todo = await api.task.get('todo-1')

      expect(todo.completed).to.eql(true)
    })

    it('completes task if scored task is a daily', async function () {
      await api.task.score('daily-1')

      let daily = await api.task.get('daily-1')

      expect(daily.completed).to.eql(true)
    })

    it('throws an error if id is not provided', async function () {
      let err = new IME.MissingArgumentError('Task id is required')

      await expect(api.task.score())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('thows an error if a non-valid direction is used', async function () {
      await expect(api.task.score('habit-1', 'foo'))
        .to.eventually.be.rejected
    })
  })

  describe('#post', () => {
    it('creates a new task', async function () {
      let task = await api.task.post()

      expect(task.id).to.exist
    })

    it('creates a new task with specified task attributes', async function () {
      let task = await api.task.post({
        type: 'todo',
        text: 'new todo',
        notes: 'new notes'
      })

      expect(task.type).to.eql('todo')
      expect(task.text).to.eql('new todo')
      expect(task.notes).to.eql('new notes')
    })
  })

  describe('#put', () => {
    it('updates an existing task', async function () {
      let task = await api.task.put(
        'todo-1',
        { text: 'updated todo name', notes: 'updated todo notes' }
      )

      expect(task.id).to.eql('todo-1')
      expect(task.text).to.eql('updated todo name')
      expect(task.notes).to.eql('updated todo notes')
    })

    it('throws an error if no task id is provided', async function () {
      let err = new IME.MissingArgumentError('Task id is required')

      await expect(api.task.put())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('throws an error if no task body is provided', async function () {
      let err = new IME.MissingArgumentError('Task body is required')

      await expect(api.task.put('habit-1'))
        .to.eventually.be.rejected.and.eql(err)
    })

    it('rejects with error if task does not exist', async function () {
      await expect(api.task.put(
        'task-does-not-exist',
        { text: 'updated todo name', notes: 'updated todo notes' }
      )).to.eventually.be.rejected
    })
  })

  describe('#del', () => {
    it('del an existing task', async function () {
      let task = await api.task.del('todo-1')
      expect(task).to.eql({})

      await expect(api.task.get('todo-1'))
        .to.eventually.be.rejected
    })

    it('throws an error if no task id is provided', async function () {
      let err = new IME.MissingArgumentError('Task id is required')

      await expect(api.task.del())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('rejects with error if task does not exist', async function () {
      await expect(api.task.del('task-does-not-exist'))
        .to.eventually.be.rejected
    })
  })
})
