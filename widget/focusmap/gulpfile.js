
var gulp      = require('gulp');
// 压缩js
var uglify    = require('gulp-uglify');
// 压缩css
var minifyCss = require('gulp-minify-css');
// 重命名
var rename    = require('gulp-rename');
// 删除
var del       = require('del');
// 检查语法
var eslint    = require('gulp-eslint');

// 清空目录
gulp.task('clear', function () {
    // 清空目录
    del(['./dist/js']);
});

// 压缩
gulp.task('build', ['clear'], function () {
    gulp.src(['./build/*.js'])
        .pipe(uglify())
        .pipe(rename('focusmap.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});