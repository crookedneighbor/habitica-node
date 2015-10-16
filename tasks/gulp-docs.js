import gulp from 'gulp';
import {sync as glob} from 'glob';
import docco from 'docco';

gulp.task('docs', (done) => {
  let options = {
    template: 'docs/assets/template.jst',
    css: 'docs/assets/css/style.css',
    args: glob('src/**/*.js'),
  };

  docco.document(options, done);
});

gulp.task('docs:watch', () => {
  gulp.watch(['./docs/assets/**', './src/**/*.js'], ['docs']);
});

