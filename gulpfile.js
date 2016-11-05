const config = require('./gulp.config.json'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  fileinclude = require('gulp-file-include'),
  source = require('vinyl-source-stream'),
  stream = require('event-stream'),
  buffer = require('vinyl-buffer'),
  babel = require('gulp-babel'),
  rollup = require('rollup-stream'),
  uglify = require('gulp-uglify'),
  size = require('gulp-size'),
  sourcemaps = require('gulp-sourcemaps'),
  cssnext = require('postcss-cssnext'),
  notify = require('gulp-notify'),
  postcss = require('gulp-postcss'),
  cssimport = require('postcss-easy-import'),
  cssnested = require('postcss-nested'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('gulp-cssnano'),
  rename = require("gulp-rename"),
  browserSync = require('browser-sync').create();

let env = process.env.NODE_ENV;

// Set up server
gulp.task('browser-sync', () => {
  browserSync.init({
    open: false,
    //ghostMode: false,
    server: config['server-root'],
    port: config['server-port']
  });
});


// Bundle all html files
gulp.task('fileinclude', () => {
  return gulp.src([config['source-html']])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .on('error', notify.onError({
      message: 'Fileinclude error: <%= error.message %>'
    }))
    .pipe(gulp.dest(config['target-html']))
    .pipe(browserSync.reload({stream:true}));
});


// Styles task
gulp.task('styles', () => {
  return gulp.src(config['source-css'])
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssimport,
      cssnested,
      mqpacker,
      cssnext
    ]))
    .pipe(gulpif(env === 'production', cssnano({ zindex: false })))
    .pipe(gulpif(env === 'production', rename('main.min.css')))
    .pipe(gulpif(env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(config['target-css']))
    .pipe(gulpif(env === 'production', size({ title: 'css bundle size -->' })))
    .pipe(browserSync.stream({match: '**/*.css'}));
});


// Watch for changes
// css: livereload
// JS & html: page refresh
gulp.task('watch', ['browser-sync'], () => {
  gulp.watch(config['source-all-css-files'], ['styles']);
  gulp.watch(config['source-all-html-files'], ['fileinclude']);
  gulp.watch(config['source-all-js-files'], ['scripts']);
});


// Transpile ES2015 => ES5
// Bundle js
gulp.task('scripts', () => {
  rollup({
    entry: config['source-js'],
    sourceMap: true,
    format: 'iife'
  })
  .on('error', e => { console.error(`${e.stack}`) })
  .pipe(source("scripts.js", "./source/js/"))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(rename('build/js/main.js'))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({stream:true}));
});


// Compress JS files for production
gulp.task('compress', function() {
  rollup({
    entry: config['source-js'],
    sourceMap: true,
    format: 'iife'
  })
  .pipe(source("scripts.js", "./source/js/"))
  .pipe(buffer())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(rename('build/js/main.min.js'))
  .pipe(uglify())
  .pipe(size({ title: 'js bundle size -->' }))
  .pipe(rename('build/js/main.min.js'))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({stream:true}));
});