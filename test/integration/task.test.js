import {generateUser} from '../support/integration_helper';
import Habitica from '../../src/index';

describe('Task', () => {
  describe('#get', () => {
    let api = new Habitica({
      endpoint: `localhost:${process.env.PORT}/api/v2`,
    });

    beforeEach((done) => {
      let update = {
        'todos': [{type: 'todo', id: 'todo-1'}],
        'habits': [{type: 'habit', id: 'habit-1'}],
        'dailys': [{type: 'daily', id: 'daily-1'}],
        'rewards': [{type: 'reward', id: 'reward-1'}],
      }
      generateUser(update, api)
        .then((creds) => {
          done();
        });
    });

    it('gets all tasks', (done) => {
      api.task.get()
        .then((tasks) => {
          expect(tasks).to.have.a.lengthOf(4);
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
});
