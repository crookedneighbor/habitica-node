import gulp from 'gulp';

if (process.env.TESTING) {
  gulp.task('prepublish');
} else {
  gulp.task('prepublish', ['lint', 'test', 'babel']);
}

