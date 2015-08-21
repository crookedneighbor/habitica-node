import Habitica from '../src/index';

describe('Habitica Api', () => {
  beforeEach(() => {
    sandbox.stub(console, 'warn');
  });

  it('warns if user id and api are not provided', () => {
    let api = new Habitica();

    expect(console.warn).to.be.calledOnce;
    expect(console.warn).to.be.calledWith('Missing credentials; Only content routes will be available');
  });
});
