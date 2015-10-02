let helper = require('./support/integration_helper');

describe('Integration Tests', () => {
  helper.runTestsInDirectory('./test/integration');
});
