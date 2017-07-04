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
var bower = require('main-bower-files');
var order = require("gulp-order");
var angularFilesort = require('gulp-angular-filesort');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

gulp.task('bower-js', function(){
  return gulp.src(bower("**/*.js"))
      .pipe(gulp.dest('./client/dist.dev/libs'));
});
gulp.task('bower-css', function(){
  return gulp.src(bower('**/*.css'))
      .pipe(gulp.dest('./client/dist.dev/libs'));
});

gulp.task('bower', ['bower-js', 'bower-css']);

gulp.task('scripts-prod', ['bower', 'sass'], function(){
  return gulp.src('./client/app/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets:['es2015']
      }))
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./client/dist.dev/js'));
});

gulp.task('scripts-dev', ['bower', 'sass'], function(){
  return gulp.src([
    './client/src/**/*.module.js',
    './client/src/**/*.js'
  ])
      .pipe(babel({
        presets:['es2015']
      }))
      .pipe(gulp.dest('./client/dist.dev'));
});

gulp.task('sass', function(){
  return gulp.src(['./client/src/scss/**/*.scss', './client/src/scss/**/*.css'])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(concat('styles.css'))
      .pipe(minifyCss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./client/dist.dev/css'))
});


gulp.task('inject', ['scripts-dev'], function () {
  var target = gulp.src('./client/src/index.html');

  var sources = gulp.src(['./client/dist.dev/js/**/*.js', './client/dist.dev/css/**/*.css'], {read: false});

  var bowerJSSources = gulp.src('./client/dist.dev/libs/**/*.js', {read: false})
          .pipe(order([
          "jquery.min.js",
          "angular.min.js",
          "**/*.js" 
          ]));
  var bowerCSSSources = gulp.src('./client/dist.dev/libs/**/*.css', {read: false});
 
  return target
    .pipe(inject(sources, {ignorePath: ['/client/dist.dev'], addRootSlash: false, name: 'inject'}))
    .pipe(inject(bowerJSSources, {ignorePath: '/client/dist.dev', addRootSlash: false, name: 'bower'}))
    .pipe(inject(bowerCSSSources, {ignorePath: '/client/dist.dev', addRootSlash: false, name: 'bower'}))

    .pipe(gulp.dest('./client/dist.dev'));
});

gulp.task('nodemon', ['inject'], function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('clean', function(cb){
  return del([
    './client/dist.dev'
  ], cb)
});