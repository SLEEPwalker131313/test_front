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
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var sass = require('gulp-sass');

var root = './client/src/';

var sources = {
  js: root + 'js/**/*.js',
  css: root + 'css/**/*.css',
  scss: root + 'scss/*.scss'
};

var output = {
  root: './client/dist/',
  dev: 'dev/',
  prod: 'prod/'
}

var bowerSourcesRoot = output.root + 'bower_sources';

var bowerSources = {
  js: bowerSourcesRoot + '/**/*.js',
  css: bowerSourcesRoot + '/**/*.css'
}


gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('main-bower-files', function() {
    return gulp.src(bower(), { base: './bower_components' })
      .pipe(gulp.dest(bowerSourcesRoot))
});


gulp.task('dev-makebowerfiles', function() {
  var bowerOutput = output.root + output.dev + 'bower_sources';

  return gulp.src(bower(), { base: './bower_components' })
    .pipe(gulp.dest(bowerOutput));
});

gulp.task('dev-makesrcfiles', function() {
  return gulp.src([root + '/**/*.js', root + '/**/*.css'])
    .pipe(gulp.dest(output.root + output.dev));
});

gulp.task('dev-sass', function() {
  return gulp.src(sources.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(output.root + output.dev + '/css'));
});

gulp.task('dev-makefiles', ['dev-makebowerfiles', 'dev-makesrcfiles', 'dev-sass']);

gulp.task('dev', ['dev-makefiles'], function() {
  var bowerOutput = output.root + output.dev + 'bower_sources';

  var target = gulp.src(root + 'index.html');

  var source = gulp.src([sources.js, sources.css], {read: false});

  var bowerJSSources = gulp.src(bowerOutput + '/**/*.js', {read: false})
    .pipe(order(["jquery/**/*.js", "angular/**/*.js", "**/*.js"]));

  var bowerCSSSources = gulp.src(bowerOutput + '/**/*.css', {read: false});
 
  return target
    .pipe(inject(source, {ignorePath: 'client/src', addRootSlash: false, name: 'inject'}))

    .pipe(inject(bowerJSSources, {ignorePath: '/output/dev', addRootSlash: false, name: 'bower'}))
    .pipe(inject(bowerCSSSources, {ignorePath: '/output/dev', addRootSlash: false, name: 'bower'}))

    .pipe(gulp.dest(output.root + output.dev));
});


gulp.task('prod-makevendorjs', function() {
  var bowerFiles = gulp.src(bower(), { base: './bower_components' });

  return bowerFiles
    .pipe(gulpFilter('**/*.js', { restore: true }))
    .pipe(order(["jquery/**/*.js", "angular/**/*.js", "**/*.js"]))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(output.root + output.prod + 'js'));
});

gulp.task('prod-makevendorcss', function() {
  var bowerFiles = gulp.src(bower(), { base: './bower_components' });

  return bowerFiles
    .pipe(gulpFilter('**/*.css', { restore: true }))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(output.root + output.prod + 'css'));
});

gulp.task('prod-makeappjs', function() {
  return gulp.src(sources.js)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets:['es2015'] }))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output.root + output.prod + 'js'));
});

//gulp.task('prod-sass', function() {
//  return gulp.src(sources.css, sources.scss)
//    .pipe(sass().on('error', sass.logError))
//    .pipe(gulp.dest(output.root + output.prod + '/css'));
//});

gulp.task('prod-makeappcss', function() {
  return gulp.src([sources.css, sources.scss])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(output.root + output.prod + 'css'));
});

gulp.task('prod-makefiles', ['prod-makevendorjs', 'prod-makevendorcss', 'prod-makeappjs', 'prod-makeappcss']);

gulp.task('prod', ['prod-makefiles'], function() {
  var JSFiles = gulp.src(output.root + output.prod + 'js/**/*.js', {read: false});
  var CSSFiles = gulp.src(output.root + output.prod + 'css/**/*.css', {read: false});

  var target = gulp.src(root + 'index.html');

  return target
    .pipe(inject(JSFiles, {ignorePath: '/output/prod', addRootSlash: false}))
    .pipe(inject(CSSFiles, {ignorePath: '/output/prod', addRootSlash: false}))
    .pipe(gulp.dest(output.root + output.prod));
});