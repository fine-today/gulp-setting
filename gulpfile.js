var gulp = require("gulp");
var del = require("del");
var fileinclude = require("gulp-file-include");
var scss = require("gulp-sass")(require("sass"));
var clean = require("gulp-clean");
var browserSync = require("browser-sync").create();

var paths = {
  dev: {
    src: "./src",
    css: "./src/scss/*.scss",
    js: "./src/js/*.js",
    html: ["./src/**/*.html", "!./src/include/*.html"],
    imgs: "./src/images/*",
  },
  dist: {
    src: "./dist",
    css: "./dist/css",
    js: "./dist/js",
    html: "./dist",
    imgs: "./dist/images",
  },
};

var scssOptions = {
  outputStyle: "expanded",
  indentType: "tab",
  indentWidth: 2,
  precision: 6,
  sourceComments: false,
};
function setHtml() {
  return gulp
    .src(paths.dev.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.dist.html))
    .pipe(browserSync.reload({ stream: true }));
}

function setJs() {
  return gulp
    .src(paths.dev.js)
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.reload({ stream: true }));
}
function setCss() {
  return gulp
    .src(paths.dev.css)
    .pipe(scss(scssOptions).on("error", scss.logError))
    .pipe(gulp.src("./src/css/*.css"), { passthrough: true })
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.reload({ stream: true }));
}

function setImgs() {
  return gulp
    .src(paths.dev.imgs)
    .pipe(gulp.dest(paths.dist.imgs))
    .pipe(browserSync.reload({ stream: true }));
}

function watchFiles() {
  gulp.watch(paths.dev.css, setCss);
  gulp.watch(paths.dev.js, setJs);
  gulp.watch(paths.dev.html, setHtml);
  gulp.watch(paths.dev.imgs, setImgs);
}
function brwSync() {
  return browserSync.init({
    server: {
      baseDir: paths.dist.src,
    },
  });
}
function setClean() {
  return gulp.src(paths.dist.src, { read: false }).pipe(clean());
}

gulp.task(
  "default",
  gulp.parallel(
    brwSync,
    gulp.series(setClean, setHtml, setCss, setJs, setImgs),
    watchFiles
  )
);
