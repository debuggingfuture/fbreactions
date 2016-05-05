var webpack = require('webpack');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var changed = require('gulp-changed');
var webpackConfig = require('./webpack.config.js');
var file = require('gulp-file');

gulp.task('webpack', function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        callback();
    });
});

gulp.task('copy', function(){
  gulp.src('./images/**')
    .pipe(changed('dist/images'))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('build', ['copy', 'webpack']);

gulp.task('deploy',['build'], function() {
 process.env.NODE_ENV='prd';
 return gulp.src('dist/**/*')
    .pipe(file('CNAME', 'fbreactions.io'))
   .pipe(ghPages({
    //  cname:"hike.code4.hk"
   }));
});
