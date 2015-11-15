var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js', 'tasks/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
