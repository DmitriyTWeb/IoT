const gulp = require('gulp');
// var plumber = require("gulp-plumber");
const sourcemap = require('gulp-sourcemaps');
const server = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const del = require('del');
const webpack = require('webpack-stream');
const path = require('path');
const webpackConfig = require('./webpack.config.js');

const webpackConfigProd = Object.assign({}, webpackConfig, { mode: 'production' });

gulp.task('webpack', function () {
  return gulp
    .src('src/index.tsx')
    .pipe(
      webpack(require('./webpack.config.js'))
    )
    .pipe(gulp.dest(path.resolve(__dirname, 'build')));
});
gulp.task('webpackProduction', function () {
  return gulp
    .src('src/index.tsx')
    .pipe(
      webpack(webpackConfigProd)
    )
    .pipe(gulp.dest(path.resolve(__dirname, 'build')));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("src/*.html", gulp.series("copyHtml", "copyImg", "refresh"));
  gulp.watch("src/components/**/*.jsx", gulp.series("webpack", "refresh"));
  gulp.watch("src/hooks/*.js", gulp.series("webpack", "refresh"));
  gulp.watch("src/*.js", gulp.series("webpack", "refresh"));
  gulp.watch("src/*.tsx", gulp.series("webpack", "refresh"));
  gulp.watch("src/services/*.js", gulp.series("webpack", "refresh"));
  gulp.watch("src/api/*.js", gulp.series("webpack", "refresh"));
  gulp.watch("src/store/*.js", gulp.series("webpack", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("css", function () {
  return gulp.src("src/sass/style.scss")
    // .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("build/"))
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/"))
    .pipe(server.stream());
});

gulp.task("copyHtml", function () {
  return gulp.src([
    "src/*.html"
  ], {
    base: "src"
  })
    .pipe(gulp.dest("build"));
});
gulp.task("copyImg", function () {
  return gulp.src([
    "src/img/*.{svg,png,ico}"
  ], {
    base: "src/img"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()

    ]))

    .pipe(gulp.dest("src/img/"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("compressImage", gulp.series("images"));

gulp.task("buildProduction", gulp.series("clean", "copyHtml", "copyImg","css", "webpackProduction"));
gulp.task("build", gulp.series("clean", "copyHtml", "copyImg", "css", "webpack"));
gulp.task("start", gulp.series("build", "webpack", "server"));
