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
});
