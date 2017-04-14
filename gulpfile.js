var gulp = require("gulp")
var sass = require("gulp-sass")
var autoprefixer = require("gulp-autoprefixer")
var mincss = require("gulp-clean-css")
var jade = require("gulp-jade")
var gutil = require("gulp-util")
var rename = require("gulp-rename")

gulp.task("demo:scss", function(){
	gulp.src("./demo/src/*.scss")
		.pipe(autoprefixer({
			browsers: ["last 4 versions"],
			cascade: true
		}))
		.pipe(sass({
			outputStyle: "expanded"
		}).on("error", gutil.log).on("error", gutil.beep))
		.pipe(gulp.dest("./demo/dist"))
})

gulp.task("demo:jade", function(){
	gulp.src("./demo/src/*.jade")
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest("./demo/dist"))
})

gulp.task("scss", function(){
	gulp.src("./src/loaders.scss")
		.pipe(sass({
			outputStyle: "expanded"
		}))
		.pipe(autoprefixer({
			browsers: ["last 4 versions"],
			cascade: true
		}))
		.pipe(gulp.dest("./"))
		.pipe(mincss())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest("./"))
})

gulp.task("watch", function(){
	gulp.watch("src/**/*.scss", ["scss"])
	gulp.watch("demo/src/**/*.scss", ["demo:scss"])
	gulp.watch("demo/src/**/*.jade", ["demo:jade"])
})

gulp.task("default", function(){
	gulp.start("scss", "demo:scss", "demo:jade", "watch")
})