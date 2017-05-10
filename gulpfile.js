var gulp = require("gulp")
var sass = require("gulp-sass")								// 编译scss样式文件
var autoprefixer = require("gulp-autoprefixer")				// 样式自动添加前缀
var mincss = require("gulp-clean-css")						// 压缩css文件
var jade = require("gulp-jade")								// 编译jade模板文件
var plumber = require("gulp-plumber")						// 用于保证steam流继续执行
var gutil = require("gulp-util")							// 主要使用日志打印功能
// var notify = require('gulp-notify')							// 用于任务提醒
var rename = require("gulp-rename")							// 文件重命名
var browserSync = require("browser-sync")					// 让浏览器自动刷新页面
var del = require("del")									// 删除文件
var changed = require("gulp-changed")						// 只编译或打包改变过文件
var htmlBeautify = require("gulp-html-beautify")			// html文件格式化

var path = {
	jade: "demo/src/",							// jade模板路径
	css: "src/",								// css文件路径
	scss: "demo/src/",							// scss文件路径
	dist: "demo/dist/"							// 输出路径
}

// 编译jade模板文件任务
gulp.task("demo:jade", function(){
	gulp.src(path.jade + "**/*.jade")
		.pipe(plumber())
		.pipe(changed(path.dist, {
			extension: ".html"
		}))
		.pipe(jade({
			pretty: true
		}).on("error", gutil.log).on("error", gutil.beep))
		.pipe(htmlBeautify({
			indent_size: 4,
			indent_char: " ",
			unformatted: true,
			extra_liners: []
		}))
		.pipe(gulp.dest(path.dist))
		.pipe(browserSync.stream())
})

// 编译scss样式文件任务
gulp.task("demo:scss", function(){
	gulp.src(path.scss + "**/*.scss")
		.pipe(changed(path.dist, {
			extension: ".css"
		}))
		.pipe(plumber())
		.pipe(sass({
			outputStyle: "expanded"
		}).on("error", gutil.log).on("error", gutil.beep))
		.pipe(autoprefixer({
			browsers: ["last 4 versions"],
			cascade: true
		}))
		.pipe(gulp.dest(path.dist))
		.pipe(browserSync.stream())
})

// 编译正式的css文件任务
gulp.task("scss", function(){
	gulp.src(path.css + "loaders.scss")
		.pipe(plumber())
		.pipe(sass({
			outputStyle: "expanded"
		}).on("error", gutil.log).on("error", gutil.beep))
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
		.pipe(gulp.dest(path.dist))
		.pipe(browserSync.stream())
})


// 构建服务任务
gulp.task("serve", function(){
	console.log("==========================================================")
	console.log("Server running at http://localhost:3000")
	console.log("==========================================================")
	browserSync({
		server: {
			baseDir: path.dist
		},
		startPath: "demo.html"

	})
	gulp.watch(path.css + "**/*.scss", ["scss"])
	gulp.watch(path.scss + "**/*.scss", ["demo:scss"])
	gulp.watch(path.jade + "**/*.jade", ["demo:jade"])
	gulp.watch(path.dist + "**").on("change", browserSync.reload)
})

// 删除文件任务
gulp.task("clean", function(cb){
	return del([path.dist + "**"], {
		force: true
	}, cb)
})

// 初始化任务
gulp.task("build", ["clean"], function(){
	gulp.start("scss", "demo:scss", "demo:jade", "serve")
})