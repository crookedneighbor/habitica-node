import {v4 as makeUuid} from 'uuid'
import {generateUser} from '../support/integration_helper'
import Habitica from '../../src/index'
import {INTERNAL_MODULE_ERRORS as IME} from '../../src/lib/errors'

describe('Task', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v3`
  })

  beforeEach(async function () {
    this.todo1id = makeUuid()
    this.todo2id = makeUuid()
    this.habit1id = makeUuid()
    this.habit2id = makeUuid()
    this.daily1id = makeUuid()
    this.daily2id = makeUuid()
    this.reward1id = makeUuid()
    this.reward2id = makeUuid()

    await generateUser(null, api)

    // Remove starting tasks
    let tasks = await api.task.get()

    await Promise.all(tasks.map((task) => api.task.del(task._id)))

    // Populate with known tasks
    await api.task.post([
      {text: 'task-1', type: 'todo', _id: this.todo1id},
      {text: 'task-2', type: 'todo', _id: this.todo2id},
      {text: 'task-3', type: 'habit', _id: this.habit1id},
      {text: 'task-4', type: 'habit', _id: this.habit2id},
      {text: 'task-5', type: 'daily', _id: this.daily1id},
      {text: 'task-6', type: 'daily', _id: this.daily2id},
      {text: 'task-7', type: 'reward', _id: this.reward1id},
      {text: 'task-8', type: 'reward', _id: this.reward2id}
    ])
  })

  describe('#get', () => {
    it('gets all tasks', async function () {
      let tasks = await api.task.get()

      expect(tasks).to.have.a.lengthOf(8)
    })

    it('gets a specific task by id', async function () {
      let task = await api.task.get(this.todo1id)

      expect(task._id).to.eql(this.todo1id)
      expect(task.text).to.eql('task-1')
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
      expect(todos).have.a.lengthOf(2)
      expect(todos[0].type).to.eql('todo')
      expect(todos[1].type).to.eql('todo')
    })
  })

  describe('#score', () => {
    it('scores up a task', async function () {
      let { value: originalValue } = await api.task.get(this.habit1id)
      let stats = await api.task.score(this.habit1id, 'up')
      let { value: newValue } = await api.task.get(this.habit1id)

      expect(stats.delta).to.be.greaterThan(0)
      expect(newValue).to.be.greaterThan(originalValue)
    })

    it('scores down a task', async function () {
      let { value: originalValue } = await api.task.get(this.habit1id)
      let stats = await api.task.score(this.habit1id, 'down')
      let { value: newValue } = await api.task.get(this.habit1id)

      expect(stats.delta).to.be.lessThan(0)
      expect(newValue).to.be.lessThan(originalValue)
    })

    it('defaults to scoring up', async function () {
      let { value: originalValue } = await api.task.get(this.habit1id)
      let stats = await api.task.score(this.habit1id)
      let { value: newValue } = await api.task.get(this.habit1id)

      expect(stats.delta).to.be.greaterThan(0)
      expect(newValue).to.be.greaterThan(originalValue)
    })

    it('completes task if scored task is a todo', async function () {
      await api.task.score(this.todo1id)
      let todo = await api.task.get(this.todo1id)

      expect(todo.completed).to.eql(true)
    })

    it('completes task if scored task is a daily', async function () {
      await api.task.score(this.daily1id)

      let daily = await api.task.get(this.daily1id)

      expect(daily.completed).to.eql(true)
    })

    it('throws an error if id is not provided', async function () {
      let err = new IME.MissingArgumentError('Task id is required')

      await expect(api.task.score())
        .to.eventually.be.rejected.and.eql(err)
    })

    it('thows an error if a non-valid direction is used', async function () {
      await expect(api.task.score(this.habit1id, 'foo'))
        .to.eventually.be.rejected
    })
  })

  describe('#post', () => {
    it('creates a new task', async function () {
      let task = await api.task.post({ text: 'foo', type: 'habit' })

      expect(task._id).to.exist
      expect(task.text).to.eql('foo')
      expect(task.type).to.eql('habit')
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
        this.todo1id,
        { text: 'updated todo name', notes: 'updated todo notes' }
      )

      expect(task._id).to.eql(this.todo1id)
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

      await expect(api.task.put(this.habit1id))
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
      let task = await api.task.del(this.todo1id)
      expect(task).to.eql({})

      await expect(api.task.get(this.todo1id))
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
