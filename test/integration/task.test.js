import {generateUser} from '../support/integration_helper';
import Habitica from '../../src/index';

describe('Task', () => {
  let api = new Habitica({
    endpoint: `localhost:${process.env.PORT}/api/v2`,
  });

  beforeEach((done) => {
    let update = {
      'todos': [
        {type: 'todo', id: 'todo-1'},
        {type: 'todo', id: 'todo-2'},
      ],
      'habits': [
        {type: 'habit', id: 'habit-1'},
        {type: 'habit', id: 'habit-2'},
      ],
      'dailys': [
        {type: 'daily', id: 'daily-1'},
        {type: 'daily', id: 'daily-2'},
      ],
      'rewards': [
        {type: 'reward', id: 'reward-1'},
        {type: 'reward', id: 'reward-2'},
      ],
    }
    generateUser(update, api)
      .then((creds) => {
        done();
      });
  });

  describe('#get', () => {
    it('gets all tasks', (done) => {
      api.task.get()
        .then((tasks) => {
          expect(tasks).to.have.a.lengthOf(8);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('gets a specific task by id', (done) => {
      api.task.get('todo-1')
        .then((task) => {
          expect(task.id).to.eql('todo-1');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('throws error if task does not exist', (done) => {
      api.task.get('todo-that-does-not-exist')
        .then((task) => {
          done(task);
        })
        .catch((err) => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('#getDailys', () => {
    it('gets only dailys', (done) => {
      api.task.getDailys()
        .then((dailys) => {
          expect(dailys).to.have.a.lengthOf(2);
          expect(dailys[0].type).to.eql('daily');
          expect(dailys[1].type).to.eql('daily');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getHabits', () => {
    it('gets only habits', (done) => {
      api.task.getHabits()
        .then((habits) => {
          expect(habits).to.have.a.lengthOf(2);
          expect(habits[0].type).to.eql('habit');
          expect(habits[1].type).to.eql('habit');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getRewards', () => {
    it('gets only rewards', (done) => {
      api.task.getRewards()
        .then((rewards) => {
          expect(rewards).to.have.a.lengthOf(2);
          expect(rewards[0].type).to.eql('reward');
          expect(rewards[1].type).to.eql('reward');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#getTodos', () => {
    it('gets only todos', (done) => {
      api.task.getTodos()
        .then((todos) => {
          expect(todos).to.have.a.lengthOf(2);
          expect(todos[0].type).to.eql('todo');
          expect(todos[1].type).to.eql('todo');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#score', () => {
    it('scores up a task', (done) => {
      let originalValue, newValue;

      api.task.get('habit-1')
        .then((habit) => {
          originalValue = habit.value;
          return api.task.score('habit-1', 'up');
        })
        .then((stats) => {
          expect(stats.delta).to.be.greaterThan(0);
          return api.task.get('habit-1');
        })
        .then((habit) => {
          newValue = habit.value;
          expect(newValue).to.be.greaterThan(originalValue);
          done();
        });
    });

    it('scores down a task', (done) => {
      let originalValue, newValue;

      api.task.get('habit-1')
        .then((habit) => {
          originalValue = habit.value;
          return api.task.score('habit-1', 'down');
        })
        .then((stats) => {
          expect(stats.delta).to.be.lessThan(0);
          return api.task.get('habit-1');
        })
        .then((habit) => {
          newValue = habit.value;
          expect(newValue).to.be.lessThan(originalValue);
          done();
        });
    });

    it('defaults to scoring up', (done) => {
      let originalValue, newValue;

      api.task.get('habit-1')
        .then((habit) => {
          originalValue = habit.value;
          return api.task.score('habit-1');
        })
        .then((stats) => {
          expect(stats.delta).to.be.greaterThan(0);
          return api.task.get('habit-1');
        })
        .then((habit) => {
          newValue = habit.value;
          expect(newValue).to.be.greaterThan(originalValue);
          done();
        });
    });

    it('creates new habit if it does not already exist', (done) => {
      api.task.score('new-habit')
        .then((stats) => {
          return api.task.get('new-habit');
        })
        .then((habit) => {
          expect(habit.type).to.eql('habit');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('allows extra data to be passed in when creating the task', (done) => {
      let todoBody = {
        type: 'todo',
        text: 'Custom Name',
        notes: 'Custom Note',
      };
      api.task.score('new-todo', 'up', todoBody)
        .then((stats) => {
          return api.task.get('new-todo');
        })
        .then((todo) => {
          expect(todo.type).to.eql('todo');
          expect(todo.text).to.eql('Custom Name');
          expect(todo.notes).to.eql('Custom Note');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('completes task if scored task is a todo', (done) => {
      api.task.score('todo-1')
        .then((stats) => {
          return api.task.get('todo-1');
        })
        .then((todo) => {
          expect(todo.completed).to.eql(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('completes task if scored task is a daily', (done) => {
      api.task.score('daily-1')
        .then((stats) => {
          return api.task.get('daily-1');
        })
        .then((daily) => {
          expect(daily.completed).to.eql(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('throws an error if id is not provided', async () => {
      await expect(api.task.score()).to.eventually.be.rejected.and.eql('Task id is required');
    });

    it('thows an error if a non-valid direction is used', (done) => {
      api.task.score('habit-1', 'foo')
        .then((stats) => {
          done(stats);
        })
        .catch((err) => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('#post', () => {
    it('creates a new task', (done) => {
      api.task.post()
        .then((task) => {
          expect(task.id).to.exist;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('creates a new task with specified task attributes', (done) => {
      api.task.post({
        type: 'todo',
        text: 'new todo',
        notes: 'new notes',
      }).then((task) => {
        expect(task.type).to.eql('todo');
        expect(task.text).to.eql('new todo');
        expect(task.notes).to.eql('new notes');
        done();
      })
      .catch((err) => {
        done(err);
      });
    });
  });

  describe('#put', () => {
    it('updates an existing task', (done) => {
      api.task.put(
        'todo-1',
        { text: 'updated todo name', notes: 'updated todo notes' }
      ).then((task) => {
        expect(task.id).to.eql('todo-1');
        expect(task.text).to.eql('updated todo name');
        expect(task.notes).to.eql('updated todo notes');
        done();
      })
      .catch((err) => {
        done(err);
      });
    });

    it('throws an error if no task id is provided', async () => {
      await expect(api.task.put()).to.eventually.be.rejected.and.eql('Task id is required');
    });

    it('throws an error if no task body is provided', async () => {
      await expect(api.task.put('habit-1')).to.eventually.be.rejected.and.eql('Task body is required');
    });

    it('returns error if task does not exist', (done) => {
      api.task.put(
        'task-does-not-exist',
        { text: 'updated todo name', notes: 'updated todo notes' }
      ).then((task) => {
        done(task);
      }).catch((err) => {
        expect(err).to.exist;
        expect(err.text).to.eql('Task not found.');
        done();
      });
    });
  });

  describe('#del', () => {
    it('del an existing task', (done) => {
      api.task.del(
        'todo-1'
      ).then((task) => {
        expect(task).to.eql({});
        return api.task.get('todo-1');
      })
      .then((task) => {
        done(task);
      })
      .catch((err) => {
        expect(err).to.exist;
        done();
      });
    });

    it('throws an error if no task id is provided', async () => {
      await expect(api.task.del()).to.eventually.be.rejected.and.eql('Task id is required');
    });

    it('returns error if task does not exist', (done) => {
      api.task.del(
        'task-does-not-exist'
      ).then((task) => {
        done(task);
      }).catch((err) => {
        expect(err).to.exist;
        expect(err.text).to.eql('Task not found.');
        done();
      });
    });
  });
});
