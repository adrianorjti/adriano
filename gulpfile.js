const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const postcss = require("gulp-postcss");
const pxtorem = require("postcss-pxtorem");

// Compila SASS
function compilaSass() {
  return gulp
    .src("assets/css/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        cascade: false,
        overrideBrowserslist: ["last 2 versions", "not dead"],
      })
    )
    .pipe(postcss([pxtorem()]))
    .pipe(gulp.dest("assets/css"));
}

// Gera Critical CSS dinamicamente com import()
async function gerarCritical() {
  const { stream } = await import("critical");
  return gulp
    .src("index.html")
    .pipe(
      stream({
        base: "./",
        inline: true,
        css: ["assets/css/style.css"],
        width: 1300,
        height: 900,
        minify: true,
      })
    )
    .pipe(gulp.dest("./"));
}

function watch() {
  gulp.watch("assets/css/scss/**/*.scss", compilaSass);
}

// Exports
exports.sass = compilaSass;
exports.watch = watch;
exports.critical = gerarCritical;
exports.build = gulp.series(compilaSass, gerarCritical);
exports.default = gulp.series(compilaSass, watch);
