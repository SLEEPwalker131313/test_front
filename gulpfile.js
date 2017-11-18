
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
var cleanCSS = require('gulp-clean-css');
var flatten = require('gulp-flatten');

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

pipes.fontsDevVendor = function(){
  return gulp.src('./bower_components/**/*.{eot,svg,ttf,woff,woff2}')
      .pipe(flatten())
      .pipe(gulp.dest('./app/fonts'))
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
      .pipe(cleanCSS())
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
      .pipe(cleanCSS())
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
      pipes.fontsDevVendor(),
      pipes.processedImagesDev(),
      pipes.processedFontsDev()
  );
};

pipes.builtAppProd = function () {
  return es.merge(
      pipes.builtIndexProd(),
      pipes.fontsDevVendor(),
      pipes.processedImagesProd(),
      pipes.processedFontsProd()
  );
};



// == TASKS ========

gulp.task('clean-tmp', function () {
  //var deferred = Q.defer();
  //del(paths.tmp, function () {
  //  deferred.resolve();
  //});
  //return deferred.promise;
  return del.sync(paths.tmp);
});

// removes all compiled dev files
gulp.task('clean-dev', function () {
  //var deferred = Q.defer();
  //del(paths.distDev, function () {
  //  deferred.resolve();
  //});
  //return deferred.promise;
  return del.sync(paths.distDev);
});

// removes all compiled production files
gulp.task('clean-prod', function () {
  //var deferred = Q.defer();
  //del(paths.distProd, function () {
  //  deferred.resolve();
  //});
  //return deferred.promise;
  return del.sync(paths.distProd);
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
gulp.task('get-font-vendor', pipes.fontsDevVendor);

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
gulp.task('clean-build-app-dev', ['clean-dev', 'clean-tmp', 'get-font-vendor'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod', 'clean-tmp', 'template-cache-prod', 'translate-prod'], pipes.builtAppProd);

//build templates for prod environment
gulp.task('template-cache-dev', pipes.templateCacheDev);
gulp.task('template-cache-prod', pipes.templateCacheProd);

gulp.task("translate-dev", pipes.translatesDev);
gulp.task("translate-prod", pipes.translatesProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev','validate-server-scripts'], function () {

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

gulp.task('dev-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('prod-env', function() {
  return process.env.NODE_ENV = 'production';
});

