import gulp from 'gulp';
import babel from 'gulp-babel';

const SOURCE = 'src/**/*.js';
const DIST = 'dist/';

gulp.task('babel', () => {
  return gulp.src(SOURCE)
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('babel:watch', () => {
  gulp.watch([SOURCE], ['babel']);
});
