import gulp from 'gulp';
import {exec} from 'child_process';

gulp.task('docs', (done) => {
  exec('node_modules/.bin/docco --template docs/assets/template.jst --css docs/assets/css/style.css src/*', (err, stdout, stderr) => {
    if (err) return done(err);
    if (stdout) console.log(stdout); // eslint-disable-line no-console
    if (stderr) console.error(stderr); // eslint-disable-line no-console

    done();
  });
});

gulp.task('docs:watch', () => {
  gulp.watch(['./docs/assets/**', './src/**/*.js'], ['docs']);
});

