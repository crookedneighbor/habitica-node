import gulp from 'gulp';
import {MongoClient as mongo} from 'mongodb';
import {sync as glob} from 'glob';
import mocha from 'gulp-mocha';

// Override the default values for the Habitica install
// Pass in your own if you'd like
process.env.PORT = process.env.HABITICA_PORT || 3321;
process.env.NODE_DB_URI = process.env.HABITICA_DB_URI || 'mongodb://localhost/habitica-node-test';
process.env.DISABLE_REQUEST_LOGGING = true;

const MOCHA_CONFIG = {
  require: ['./test/support/globals'],
};

gulp.task('test', ['test:prepare'], () => {
  let tests = glob('./test/**/*.js');

  return runTests(tests);
});

gulp.task('test:integration', ['test:prepare'], () => {
  let tests = glob('./test/integration/**/*.js');

  return runTests(tests);
});

gulp.task('test:integration:noExit', ['test:prepare'], () => {
  let tests = glob('./test/integration/**/*.js');

  return runTests(tests, true);
});

gulp.task('test:integration:watch', ['test:integration:noExit'], () => {
  gulp.watch(['src/**', 'test/integration/**'], ['test:integration:noExit']);
});

gulp.task('test:unit', () => {
  let tests = glob('./test/unit/**/*.js');

  return runTests(tests);
});

gulp.task('test:unit:noExit', ['test:prepare'], () => {
  let tests = glob('./test/unit/**/*.js');

  return runTests(tests, true);
});

gulp.task('test:unit:watch', ['test:unit:noExit'], () => {
  gulp.watch(['src/**', 'test/unit/**'], ['test:unit:noExit']);
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

function runTests(source, noExit) {
  return gulp.src(source, { read: false })
    .pipe(mocha(MOCHA_CONFIG))
    .on('end', () => {
      if (!noExit) process.exit();
    });
}
