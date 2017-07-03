/**
 * Created by SNSukhanov on 03.07.2017.
 */

/*
* gulp - basic plugin
* gulp-nodemon - for run http server
* gulp-inject - for inject files into index.html
* main-bower-files - for build bower files
*
*
* */


var gulp = require('gulp');
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');
var mainBowerFiles = require('main-bower-files');

gulp.task('inject', function () {
  var target = gulp.src('./client/src/index.html');

  var sources = gulp.src(['./client/src/js/**/*.js', './client/src/css/**/*.css'], {read: false});

  var bowerJSSources = gulp.src('./client/src/bower/**/*.js', {read: false});
  var bowerCSSSources = gulp.src('./client/src/bower/**/*.css', {read: false});
 
  return target
    .pipe(inject(sources, {ignorePath: '/client/src', addRootSlash: false, name: 'inject'}))

    .pipe(inject(bowerJSSources, {ignorePath: '/client/src', addRootSlash: false, name: 'bower'}))
    .pipe(inject(bowerCSSSources, {ignorePath: '/client/src', addRootSlash: false, name: 'bower'}))

    .pipe(gulp.dest('./client/src'));
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('main-bower-files', function() {
    return gulp.src(mainBowerFiles(), { base: './bower_components' })
        .pipe(gulp.dest('./client/src/bower'))
});