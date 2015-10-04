import {runTestsInDirectory} from './support/test_runner';

// Override the default values for the Habitica install
// Pass in your own if you'd like
process.env.PORT = process.env.HABITICA_PORT || 3321;
process.env.NODE_DB_URI = process.env.HABITICA_DB_URI || 'mongodb://localhost/habitica-node-test';
const PATH_TO_HABITICA = process.env.PATH_TO_HABITICA || '../../habitrpg';

require(`${PATH_TO_HABITICA}/website/src/server.js`);

describe('Integration Tests', () => {
  runTestsInDirectory('./test/integration');
});
