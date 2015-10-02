import sinon from 'sinon';
global.sandbox = sinon.sandbox.create();
chai.use(require('sinon-chai'));

afterEach(() => {
  global.sandbox.restore();
});
