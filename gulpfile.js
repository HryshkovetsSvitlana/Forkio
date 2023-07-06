const gulp = require('gulp')
const gulpClean = require('gulp-clean')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const cssMin = require('gulp-cssmin')
const jsMinify = require('gulp-js-minify')
const autoprefixer = require('gulp-autoprefixer')
const purgecss = require('gulp-purgecss')
const imageMin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()

gulp.task('default', function () {
  return new Promise((resolve, reject) => {
    resolve()
  })
})

function clean() {
  return gulp.src('dist', { allowEmpty: true }).pipe(gulpClean())
}
gulp.task('clean', clean)

function compileScss() {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css-compiled/'))
}

function processCss() {
  return gulp
    .src('src/css-compiled/*.css')
    .pipe(concat('style.min.css'))
    .pipe(purgecss({ content: ['index.html', 'src/**/*.js'] }))
    .pipe(
      autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
        cascade: true,
      })
    )
    .pipe(cssMin())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
}

function cleanCompiledCss() {
  return gulp.src('src/css-compiled/', { allowEmpty: true }).pipe(gulpClean())
}

function concatAndMinifyJs() {
  return gulp
    .src('src/js/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(jsMinify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())
}

function copyImg() {
  return gulp
    .src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imageMin())
    .pipe(gulp.dest('dist/img'))
}

gulp.task(
  'build',
  gulp.series(
    'clean',
    compileScss,
    processCss,
    cleanCompiledCss,
    concatAndMinifyJs,
    copyImg
  )
)

gulp.task('dev', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  })
  gulp.watch('index.html').on('change', browserSync.reload)
  gulp.watch(
    'src/scss/**/*.scss',
    gulp.series(compileScss, processCss, cleanCompiledCss)
  )
  gulp.watch('src/js/*.js', concatAndMinifyJs)
  gulp.watch('src/img/**/*.+(png|jpg|jpeg|gif|svg)', copyImg)
})
