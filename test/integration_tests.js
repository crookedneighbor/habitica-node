import {runTestsInDirectory} from './support/test_runner';

describe('Integration Tests', () => {
  runTestsInDirectory('./test/integration');
});
