import chai from 'chai';
import sinon from 'sinon';

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

global.sinon = sinon;
global.expect = chai.expect;
global.endpoint = 'https://habitica.com/api/v2';
