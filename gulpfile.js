/**
 * @author myqianlan
 * @date 2014年11月19日17:12:44
 */
// 包含gulp   
var gulp = require('gulp');

// 包含插件   
// sass 编译
var sass = require('gulp-sass');
//sourcemaps
var sourcemaps = require('gulp-sourcemaps');
// 压缩JS
var uglify = require('gulp-uglify');
// 压缩CSS
var minifycss = require('gulp-minify-css');
// 重命名
var rename = require('gulp-rename');
// 自动加CSS浏览器前缀
var autoprefixer = require('gulp-autoprefixer');

// Compile SASS  
// with node sass
gulp.task('sass', function() {
    gulp.src('./simplepop.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(sourcemaps.write('./',{debug: true, includeContent: false}))
        .pipe(gulp.dest('./'));
});

// 自动添加浏览器前缀
// By default, Autoprefixer uses > 1%, last 2 versions, Firefox ESR, Opera 12.1
gulp.task('autoprefixer', function() {
    gulp.src('./simplepop.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('./'));
});

// 压缩JS文件 
gulp.task('minifyjs', function() {
    gulp.src('./simplepop.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./'));
});

// 压缩CSS文件   
gulp.task('minifycss', function() {
    gulp.src('./simplepop.css')
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./'));
});
//
gulp.task('dev', ['sass'], function() {
    // 监视scss文件的变化,并且执行sass
    // 如果scss文件夹为空，任务会中断
    gulp.watch('./simplepop.scss', ['sass']);
});

// 默认任务   
gulp.task('default', ['dev']);
// 构建任务
gulp.task('build', ['minifyjs', 'sass', 'autoprefixer', 'minifycss']);
