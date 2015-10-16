import gulp from 'gulp';
import {sync as glob} from 'glob';
import ghPages from 'gulp-gh-pages';

gulp.task('gh-pages', ['docs'], () => {
  return gulp.src('./docs/**/*')
  .pipe(ghPages());
});
