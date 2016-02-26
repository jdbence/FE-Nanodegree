var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  plumber = require('gulp-plumber'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  minifyCss = require('gulp-minify-css'),
  del = require('del'),
  config = require('./config');
  
var onError = function(err) {
	console.log(err);
}

gulp.task('images', function () {
    return gulp.src(config.src + '/**/*.{png,gif,jpg}')
      .pipe(plumber({
			  errorHandler: onError
		  }))
		  .pipe(imagemin())
		  .pipe(plumber.stop())
		  .pipe(gulp.dest(config.build));
});

gulp.task('html', function () {
  return gulp.src(config.src + '/*.html')
    .pipe(plumber())
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.build));
});

// Removes all the files from the build folder
gulp.task("clean", function () {
  return del([config.build + '/**', '!' + config.build]);
});

gulp.task('build', ['html']);
gulp.task('default', ['build']);