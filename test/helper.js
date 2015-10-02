import sinon from 'sinon';
import chai from 'chai';
import nock from 'nock';

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

global.nock = nock;
global.expect = chai.expect;
global.sandbox = sinon.sandbox.create();

global.endpoint = 'https://habitica.com/api/v2';

afterEach(() => {
  global.sandbox.restore();
});

