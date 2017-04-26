var gulp = require("gulp")
var sass = require("gulp-sass")
var autoprefixer = require("gulp-autoprefixer")
var mincss = require("gulp-clean-css")
var jade = require("gulp-jade")
var gutil = require("gulp-util")
var rename = require("gulp-rename")
var plumber = require("gulp-plumber")
var browserSync = require("browser-sync")
// var del = require("del")

gulp.task("demo:scss", function(){
	gulp.src("./demo/src/*.scss")
		.pipe(plumber()) 
		.pipe(autoprefixer({
			browsers: ["last 4 versions"],
			cascade: true
		}))
		// .pipe(sass.sync().on("error", sass.logError))
		.pipe(sass({
			outputStyle: "expanded"
		}).on("error", gutil.log).on("error", gutil.beep))
		.pipe(gulp.dest("./demo/dist"))
		.pipe(browserSync.stream())
})

gulp.task("demo:jade", function(){
	gulp.src("./demo/src/*.jade")
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest("./demo/dist"))
		.pipe(browserSync.stream())
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
		.pipe(gulp.dest("./demo/dist"))
		.pipe(browserSync.stream())
})

// gulp.task("clean", function(cb){
// 	return del(["demo/dist/**/*", "*.css"], cb)
// })


gulp.task("serve", function(){
	console.log("==========================================================")
	console.log("running at http://localhost:3000/demo.html")
	console.log("==========================================================")
	browserSync({
		server: {
			baseDir: "demo/dist"
		}
	})
	gulp.watch("src/**/*.scss", ["scss"])
	gulp.watch("demo/src/**/*.scss", ["demo:scss"])
	gulp.watch("demo/src/**/*.jade", ["demo:jade"])
	gulp.watch("demo/dist/**/*.*").on("change", browserSync.reload)
})

gulp.task("default", function(){
	gulp.start("scss", "demo:scss", "demo:jade", "serve")
})