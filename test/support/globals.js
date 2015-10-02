import chai from 'chai';

chai.use(require('chai-as-promised'));

global.chai = chai;
global.expect = chai.expect;
global.endpoint = 'https://habitica.com/api/v2';
