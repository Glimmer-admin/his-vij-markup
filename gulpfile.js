const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");

// Sassのタスク
function compileSass() {
  return gulp
    .src("./scss/**/*.scss") // scss ディレクトリ内のすべての SCSS ファイルを対象に
    .pipe(sass().on("error", sass.logError)) // Sassのコンパイル
    .pipe(
      rename(function (path) {
        // output file path を指定するための rename 函数
        path.extname = ".css"; // 拡張子を .css に設定
      })
    )
    .pipe(gulp.dest("./assets/css/")) // 出力先ディレクトリ
    .on("end", () => console.log("scss compile")); // 完了メッセージ
}

// Watchタスク
function watchFiles() {
  gulp.watch("./scss/**/*.scss", compileSass); // 監視対象と実行タスク
  console.log("watch start");
}

// デフォルトタスク
exports.default = gulp.series(compileSass, watchFiles);
