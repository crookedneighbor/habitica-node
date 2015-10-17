import gulp from 'gulp';
import {resolve} from 'path';
import {MongoClient as mongo} from 'mongodb';
import {sync as glob} from 'glob';
import Mocha from 'mocha';

require('../test/support/globals');

// Override the default values for the Habitica install
// Pass in your own if you'd like
process.env.PORT = process.env.HABITICA_PORT || 3321;
process.env.NODE_DB_URI = process.env.HABITICA_DB_URI || 'mongodb://localhost/habitica-node-test';
process.env.DISABLE_REQUEST_LOGGING = true;

gulp.task('test', ['test:prepare'], (done) => {
  let tests = glob('./test/**/*.js');

  runTests(tests, (err, report) => {
    process.exit(report);
    done();
  });
});

gulp.task('test:integration', ['test:prepare'], (done) => {
  let tests = glob('./test/integration/**/*.js');

  runTests(tests, (err, report) => {
    if (!process.env.RUN_INTEGRATION_TEST_FOREVER) {
      process.exit(report);
    }
    done();
  });
});

gulp.task('test:integration:watch', ['test:prepare'], () => {
  process.env.RUN_INTEGRATION_TEST_FOREVER = true;

  gulp.watch(['src/**', 'test/integration/**'], ['test:integration']);
});

gulp.task('test:unit', (done) => {
  let tests = glob('./test/unit/**/*.js');
  runTests(tests, done);
});

gulp.task('test:unit:watch', ['test:unit'], () => {
  gulp.watch(['src/**', 'test/unit/**'], ['test:unit']);
});

gulp.task('test:prepare', ['test:dropDB', 'test:startHabitica']);

gulp.task('test:dropDB', (done) => {
  mongo.connect(process.env.NODE_DB_URI, (err, db) => {
    if (err) throw err;

    db.dropDatabase(done);
  });
});

gulp.task('test:startHabitica', ['test:dropDB'], (done) => {
  const PATH_TO_HABITICA = process.env.PATH_TO_HABITICA || '../../habitrpg';

  let server = require(`${PATH_TO_HABITICA}/website/src/server.js`);
  server.listen(process.env.PORT, done);
});

function runTests(tests, cb) {
  let mocha = new Mocha();

  tests.forEach((test) => {
    delete require.cache[resolve(test)];
    mocha.addFile(test);
  });

  mocha.run((numberOfFailures) => {
    cb(null, numberOfFailures);
  });
}
