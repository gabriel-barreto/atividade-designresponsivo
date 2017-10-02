const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const csscomments = require('gulp-strip-css-comments');
const cssmin = require('gulp-cssmin');
const copy = require('gulp-copy');
const gulp = require('gulp');
const htmlMin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglifyCss = require('gulp-uglifycss');


gulp.task('cleanCss', function() {
	gulp.src('./dist/scss')
	.pipe(clean());
});

gulp.task('cleanIndex', function() {
	gulp.src('./dist/index.html')
	.pipe(clean());
});

gulp.task('sass', ['cleanCss'], function() {
	return gulp.src('./source/stylesheets/main.scss')
	.pipe(sass({ outputStyle: 'compressed' })
		.on('error', notify.onError({ title: 'Sass Error', message: "<%= error.message %>" })))
	.pipe(sourcemaps.init())
	.pipe(cssmin())
	.pipe(csscomments({ all: true }))
	.pipe(uglifyCss({ "maxLineLen": 80, "uglyComments": true }))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/css/'));
});

gulp.task('compressIndex', ['cleanIndex'], function() {
	return gulp.src('source/index.html')
	.pipe(htmlMin({
		collapseWhitespace: true,
		minifyCSS: true,
		removeTagWhitespace: true
	}))
	.pipe(gulp.dest('./dist'));
});

gulp.task('copy-fonts', function() {
	gulp.src('./source/stylesheets/fonts/**/*.*').pipe(copy('./dist/css/fonts/', { prefix: 3 }));
});

gulp.task('default', ['copy-fonts'], function() {
	gulp.watch(['./source/stylesheets/*.scss'], ['sass']);
	gulp.watch(['./source/index.html'], ['compressIndex']);
});

gulp.task('build', ['compressIndex', 'sass', 'copy-fonts'], function() {});