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


//var gulp = require('gulp');
//var inject = require('gulp-inject');
//var nodemon = require('gulp-nodemon');
//var bower = require('main-bower-files');
//var order = require("gulp-order");
//var angularFilesort = require('gulp-angular-filesort');
//
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var sass = require('gulp-sass');
//var plumber = require('gulp-plumber');
//var minifyCss = require('gulp-minify-css');
//var del = require('del');
//var babel = require('gulp-babel');
//var sourcemaps = require('gulp-sourcemaps');
//
//var notify = require('gulp-notify');
//var livereload = require('gulp-livereload');
//
//gulp.task('bower-js', function(){
//  return gulp.src(bower("**/*.js"))
//      .pipe(gulp.dest('./client/dist.dev/libs'));
//});
//gulp.task('bower-css', function(){
//  return gulp.src(bower('**/*.css'))
//      .pipe(gulp.dest('./client/dist.dev/libs'));
//});
//
//gulp.task('bower', ['bower-js', 'bower-css']);
//
//gulp.task('scripts-prod', ['bower', 'sass'], function(){
//  return gulp.src('./client/app/js/**/*.js')
//      .pipe(sourcemaps.init())
//      .pipe(babel({
//        presets:['es2015']
//      }))
//      .pipe(concat('app.js'))
//      .pipe(uglify())
//      .pipe(sourcemaps.write('.'))
//      .pipe(gulp.dest('./client/dist.dev/js'));
//});
//
//gulp.task('scripts-dev', ['bower', 'sass'], function(){
//  return gulp.src([
//    './client/src/**/*.module.js',
//    './client/src/**/*.js'
//  ])
//      .pipe(babel({
//        presets:['es2015']
//      }))
//      .pipe(gulp.dest('./client/dist.dev'));
//});
//
//gulp.task('sass', function(){
//  return gulp.src(['./client/src/scss/**/*.scss', './client/src/scss/**/*.css'])
//      .pipe(plumber())
//      .pipe(sourcemaps.init())
//      .pipe(sass())
//      .pipe(concat('styles.css'))
//      .pipe(minifyCss())
//      .pipe(sourcemaps.write())
//      .pipe(gulp.dest('./client/dist.dev/css'))
//});
//
//
//gulp.task('inject', ['scripts-dev'], function () {
//  var target = gulp.src('./client/src/index.html');
//
//  var sources = gulp.src(['./client/dist.dev/js/**/*.js', './client/dist.dev/css/**/*.css'], {read: false});
//
//  var bowerJSSources = gulp.src('./client/dist.dev/libs/**/*.js', {read: false})
//          .pipe(order([
//          "jquery.min.js",
//          "angular.min.js",
//          "**/*.js"
//          ]));
//  var bowerCSSSources = gulp.src('./client/dist.dev/libs/**/*.css', {read: false});
//
//  return target
//    .pipe(inject(sources, {ignorePath: ['/client/dist.dev'], addRootSlash: false, name: 'inject'}))
//    .pipe(inject(bowerJSSources, {ignorePath: '/client/dist.dev', addRootSlash: false, name: 'bower'}))
//    .pipe(inject(bowerCSSSources, {ignorePath: '/client/dist.dev', addRootSlash: false, name: 'bower'}))
//
//    .pipe(gulp.dest('./client/dist.dev'));
//});
//
//gulp.task('nodemon', ['inject'], function () {
//  nodemon({
//    script: 'server.js',
//    ext: 'js html',
//    env: { 'NODE_ENV': 'development' }
//  })
//});
//
//gulp.task('clean', function(cb){
//  return del([
//    './client/dist.dev'
//  ], cb)
//});



var gulp = require('gulp');
var path = require('path');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var print = require('gulp-print');
var Q = require('q');
var yaml = require('gulp-yaml');
var yamlMerge = require('gulp-yaml-merge');
var concat = require('gulp-concat');
var merge = require('gulp-merge-json');
var insert = require('gulp-insert');
var ngConstant = require('gulp-ng-constant');

// == PATH STRINGS ========

var paths = {
  scriptsDev: [
    'app/**/*.module.js',
    'app/**/*.js'
  ],
  scriptsProd: [
    'app/**/*.module.js',
    './tmp/**/*.module.js',
    'app/**/*.js',
    './tmp/**/*.js'
  ],
  scriptsWatch: 'app/js/**/*.js',
  templates: 'app/**/*.html',
  styles: ['./app/**/*.css', './app/**/*.scss'],
  images: './app/images/**/*',
  fonts: './app/fonts/**/*',
  index: './app/index.html',
  partials: ['app/**/*.html', '!app/index.html'],
  distDev: './dist.dev',
  distProd: './dist.prod',
  scriptsDevServer: 'server.js',
  translates: './app/translations/**/*.yaml',
  tmp: './tmp'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function () {
  return plugins.order(['jquery.js', 'angular.js', 'moment.js', 'handlebars.js', 'jquery.dataTables.js', 'bootstrap.js', 'moment.js', 'load-image.js', 'load-image-meta.js', 'load-image-exif.js', 'load-image-exif-map.js']);
};

pipes.orderedAppScripts = function () {
  return plugins.angularFilesort();
};

pipes.validatedAppScripts = function (scripts) {
  return gulp.src(scripts)
    //.pipe(plugins.plumber())
      .pipe(plugins.babel({
        presets: ['es2015']
      }))
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
};

pipes.validateServerScripts = function () {
  return gulp.src(paths.scriptsDevServer)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError());
};

pipes.validatePartials = function () {
  return gulp.src(paths.partials)
      .pipe(plugins.plumber())
      .pipe(plugins.htmlhint({'doctype-first': false}))
      .pipe(plugins.htmlhint.reporter());
};

pipes.validateIndex = function () {
  return gulp.src(paths.index)
      .pipe(plugins.htmlhint())
      .pipe(plugins.htmlhint.reporter());
};

pipes.scriptedPartials = function () {
  return pipes.validatePartials()
      .pipe(plugins.htmlhint.failReporter())
      .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
      .pipe(plugins.ngHtml2js({
        moduleName: "app"
      }));
};

pipes.builtAppScriptsDev = function () {
  return pipes.validatedAppScripts(paths.scriptsDev)
      .pipe(gulp.dest(paths.distDev));
};

pipes.builtAppScriptsProd = function () {
  var validatedAppScripts = pipes.validatedAppScripts(paths.scriptsProd);

  return es.merge(validatedAppScripts)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app.min.js'))
      .pipe(plugins.uglify({mangle: false}))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(paths.distProd + '/scripts'))

};

pipes.builtVendorScriptsDev = function () {
  return gulp.src(bowerFiles())
      .pipe(gulp.dest('dist.dev/bower_components'));
};

pipes.builtVendorScriptsProd = function () {
  return gulp.src(bowerFiles('**/*.js'))
      .pipe(plugins.concat('vendor.min.js'))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.distProd + '/scripts'));
};

pipes.builtVendorCssProd = function() {
  return gulp.src(bowerFiles('**/*.css'))
      .pipe(plugins.concat('vendor.min.css'))
      .pipe(plugins.minifyCss())
      .pipe(gulp.dest(paths.distProd + '/styles'));
};

pipes.builtStylesDev = function () {
  return gulp.src(paths.styles)
      .pipe(plugins.plumber())
      .pipe(plugins.sass())
      .pipe(gulp.dest(paths.distDev));
};

pipes.builtStylesProd = function () {
  return gulp.src(paths.styles)
      .pipe(plugins.plumber()) // add from dev
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass())
      .pipe(plugins.minifyCss())
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(paths.distProd));
};

pipes.processedImagesDev = function () {
  return gulp.src(paths.images)
      .pipe(gulp.dest(paths.distDev + '/images/'));
};

pipes.processedImagesProd = function () {
  return gulp.src(paths.images)
      .pipe(gulp.dest(paths.distProd + '/images/'));
};

pipes.processedFontsDev = function () {
  return gulp.src(paths.fonts)
      .pipe(gulp.dest(paths.distDev + '/fonts/'));
};

pipes.processedFontsProd = function () {
  return gulp.src(paths.fonts)
      .pipe(gulp.dest(paths.distProd + '/fonts/'));
};

pipes.templateCacheDev = function () {
  return gulp.src(paths.templates)
      .pipe(plugins.angularTemplatecache('templates.module.js',  { module:'templates', standalone:true}))
      .pipe(gulp.dest(paths.distDev + '/templates/'));
};

pipes.templateCacheProd = function () {
  return gulp.src(paths.templates)
      .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
      .pipe(plugins.angularTemplatecache('templates.module.js',  { module:'templates', standalone:true}))
      .pipe(gulp.dest(paths.tmp));
};

pipes.translatesDev = function() {
  "use strict";
  return gulp.src(paths.translates)
      .pipe(yamlMerge('translate.constant.yaml'))
      .pipe(yaml({space: 4}))
      .pipe(ngConstant({
        name: 'core',
        deps: false,
        wrap: false
      }))
      .pipe(insert.wrap(
          ';(function(angular){"use strict";',
          '})(angular);'
      ))
      .pipe(gulp.dest(paths.distDev + '/js/constants'));
};

pipes.translatesProd = function() {
  "use strict";
  return gulp.src(paths.translates)
      .pipe(yamlMerge('translate.constant.yaml'))
      .pipe(yaml({space: 4}))
      .pipe(ngConstant({
        name: 'core',
        deps: false,
        wrap: false
      }))
      .pipe(insert.wrap(
          ';(function(angular){"use strict";',
          '})(angular);'
      ))
      .pipe(gulp.dest(paths.tmp));
};

pipes.builtIndexDev = function () {

  var orderedVendorScripts = pipes.builtVendorScriptsDev()
      .pipe(pipes.orderedVendorScripts());

  var orderedAppScripts = pipes.builtAppScriptsDev()
      .pipe(pipes.orderedAppScripts());

  var translatesScripts = pipes.translatesDev();

  var templateCache = pipes.templateCacheDev();

  var appStyles = pipes.builtStylesDev();

  return pipes.validateIndex()
      .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
      .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
      .pipe(plugins.inject(orderedAppScripts, {relative: true}))
      .pipe(plugins.inject(translatesScripts, {relative: true, name: 'translates'}))
      .pipe(plugins.inject(templateCache, {relative: true, name: 'template'}))
      .pipe(plugins.inject(appStyles, {relative: true}))
      .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function () {

  var orderedVendorScripts = pipes.builtVendorScriptsProd()
      .pipe(pipes.orderedVendorScripts());

  var orderedAppScripts = pipes.builtAppScriptsProd();

  var vendorStyles = pipes.builtVendorCssProd();

  var appStyles = pipes.builtStylesProd();

  return pipes.validateIndex()
      .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
      .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
      .pipe(plugins.inject(orderedAppScripts, {relative: true}))
      .pipe(plugins.inject(vendorStyles, {relative: true, name: 'bower'}))
      .pipe(plugins.inject(appStyles, {relative: true}))
      .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
      .pipe(gulp.dest(paths.distProd));
};



pipes.builtAppDev = function () {
  return es.merge(
      pipes.builtIndexDev(),
      pipes.processedImagesDev(),
      pipes.processedFontsDev()
  );
};

pipes.builtAppProd = function () {
  return es.merge(
      pipes.builtIndexProd(),
      pipes.processedImagesProd(),
      pipes.processedFontsProd()
  );
};



// == TASKS ========

gulp.task('clean-tmp', function () {
  var deferred = Q.defer();
  del(paths.tmp, function () {
    deferred.resolve();
  });
  return deferred.promise;
});

// removes all compiled dev files
gulp.task('clean-dev', function () {
  var deferred = Q.defer();
  del(paths.distDev, function () {
    deferred.resolve();
  });
  return deferred.promise;
});

// removes all compiled production files
gulp.task('clean-prod', function () {
  var deferred = Q.defer();
  del(paths.distProd, function () {
    deferred.resolve();
  });
  return deferred.promise;
});

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatePartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validateIndex);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs eslint on the dev server scripts
gulp.task('validate-server-scripts', pipes.validateServerScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', ['template-cache-prod', 'translate-prod'], pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.builtStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev', 'clean-tmp'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod', 'clean-tmp', 'template-cache-prod', 'translate-prod'], pipes.builtAppProd);

//build templates for prod environment
gulp.task('template-cache-dev', pipes.templateCacheDev);
gulp.task('template-cache-prod', pipes.templateCacheProd);

gulp.task("translate-dev", pipes.translatesDev);
gulp.task("translate-prod", pipes.translatesProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev', 'validate-server-scripts'], function () {

  // start nodemon to auto-reload the dev server
  plugins.nodemon({script: 'server.js', ext: 'js', watch: ['devServer/'], env: {NODE_ENV: 'development'}})
      .on('change', ['validate-server-scripts'])
      .on('restart', function () {
        console.log('[nodemon] restarted dev server');
      });

  // start live-reload server
  plugins.livereload.listen({start: true});

  // watch index
  gulp.watch(paths.index, function () {
    return pipes.builtIndexDev()
        .pipe(plugins.livereload());
  });

  // watch app scripts
  gulp.watch(paths.scriptsWatch, function () {
    return pipes.builtAppScriptsDev()
        .pipe(plugins.livereload());
  });

  // watch html partials
  gulp.watch(paths.partials, function () {
    return pipes.templateCacheDev()
        .pipe(plugins.livereload());
  });

  // watch styles
  gulp.watch(paths.styles, function () {
    return pipes.builtStylesDev()
        .pipe(plugins.livereload());
  });

  gulp.watch(paths.translates, function() {
    return pipes.translatesDev()
        .pipe(plugins.livereload());
  });
});

gulp.task('build-prod', ['clean-build-app-prod', 'validate-server-scripts'], function() {
  del(paths.tmp);
});

// clean, build, and watch live changes to the prod environment
gulp.task('start-prod', ['build-prod'], function () {


  // start nodemon to auto-reload the dev server
  plugins.nodemon({script: 'server.js', ext: 'js', watch: ['devServer/'], env: {NODE_ENV: 'production'}})
      .on('change', ['validate-server-scripts'])
      .on('restart', function () {
        console.log('[nodemon] restarted dev server');
      });

});

// default task builds for prod
gulp.task('default', ['clean-build-app-prod']);

