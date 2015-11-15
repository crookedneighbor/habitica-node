var gulp = require('gulp');
var babel = require('gulp-babel');

const SOURCE = 'src/**/*.js';
const DIST = 'dist/';

gulp.task('babel', () => {
  return gulp.src(SOURCE)
    .pipe(babel({
      comments: false,
    }))
    .pipe(gulp.dest(DIST));
});

gulp.task('babel:watch', () => {
  gulp.watch([SOURCE], ['babel']);
});
