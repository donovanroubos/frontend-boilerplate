'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');

gulp.task('html', function() {
	return gulp.src('./src/views/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./public'))
		.pipe(browserSync.reload({
			stream: true,
			once: true
		}))
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
		.pipe(uglifycss({
        "maxLineLen": 80
    }))
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(browserSync.reload({
			stream: true,
			once: true
		}))
});

gulp.task('json', function() {
	gulp.src('./src/data/**/*.json')
		.pipe(gulp.dest('./public/assets/data'))
		.pipe(browserSync.reload({
			stream: true,
			once: true
		}))
});

gulp.task('img', function() {
	gulp.src('./src/images/**/*.*')
    .pipe(imagemin())
		.pipe(gulp.dest('public/assets/images'))
})

gulp.task('babel', function() {
	return gulp.src('./src/js/main.js')
		.pipe(sourcemaps.init())
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js'))
		.pipe(browserSync.reload({
			stream: true,
			once: true
		}))
})

gulp.task('watch', function () {
  browserSync.init({
		server: {
			baseDir: './public'
		}
	})
  gulp.watch('./src/**/*.html', ['html'])
	gulp.watch('./src/scss/**/*.scss', ['sass'])
	gulp.watch('./src/data/*.json', ['json'])
	gulp.watch('./src/js/**/*.js', ['babel'])
});

gulp.task('default', ['html', 'sass', 'json', 'img', 'babel', 'watch']);
