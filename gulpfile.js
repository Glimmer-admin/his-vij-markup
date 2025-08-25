const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));

function compilePages() {
  return gulp.src(["./scss/pages/**/*.scss", "!./scss/pages/**/_*.scss"], { base: "./scss" }).pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./assets/css")); // assets/css/pages/**.css になる
}

function compileOthers() {
  return gulp.src(["./scss/**/*.scss", "!./scss/pages/**", "!./scss/**/_*.scss"]).pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./assets/css")); // 例: scss/main.scss → assets/css/main.css
}

function watchFiles() {
  gulp.watch("./scss/pages/**/*.scss", compilePages);
  gulp.watch(["./scss/**/*.scss", "!./scss/pages/**"], compileOthers);
  console.log("watch start");
}

exports.default = gulp.series(gulp.parallel(compilePages, compileOthers), watchFiles);
