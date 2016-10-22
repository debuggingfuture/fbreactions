var webpack = require('webpack')
var ghPages = require('gulp-gh-pages')
var gulp = require('gulp')
var changed = require('gulp-changed')
var webpackConfig = require('./webpack.config.js')
var file = require('gulp-file')

process.env.NODE_ENV = 'prd'
gulp.task('webpack', function (callback) {
  // run webpack
  webpack(webpackConfig, function (err, stats) {
    if (err) throw err
    callback()
  })
})

gulp.task('copyCommon', function () {
  gulp.src('../common/meta.js')
    .pipe(gulp.dest('./src/app/'))
})

gulp.task('copy', function () {
  gulp.src('./images/**')
    .pipe(changed('dist/images'))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('build', ['copy', 'webpack'])

gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(file('CNAME', 'fbreactions.io'))
    .pipe(ghPages({
      //  cname:"hike.code4.hk"
    }))
})
