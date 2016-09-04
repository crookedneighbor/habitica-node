var gulp = require('gulp')
var glob = require('glob').sync
var docco = require('docco')
var ghPages = require('gulp-gh-pages')

gulp.task('docs:deploy', ['docs'], () => {
  return gulp.src('./docs/**/*')
  .pipe(ghPages())
})

gulp.task('docs:watch', () => {
  gulp.watch(['./docs/assets/**', './src/**/*.js'], ['docs'])
})

