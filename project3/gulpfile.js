var gulp = require('gulp'),
    gutil = require('gulp-util'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jscs = require('gulp-jscs'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    path = require('path'),
    fs = require('fs');

var includeJS = [
    'js/el.js',
    'js/entity.js',
    'js/resources.js',
    'js/collision.js',
    'js/engine.js',
    'js/model.js',
    'js/timer.js',
    'js/grid.js',
    'js/level.js',
    'js/scene.js',
    'js/sensor.js',
    'js/render.js',
    'js/keyboardInput.js',
    'js/movement.js',
    'js/blueprint.js',
    'js/ui.js',
    'js/key.js',
    'js/water.js',
    'js/enemy.js',
    'js/player.js',
    'js/star.js',
    'js/explosion.js',
    'js/app.js'
];
    
    
gulp.task('lint', function () {
    return gulp.src('./js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format('html', function(results){
            fs.writeFileSync(path.join(__dirname, './build/lint.html'), results);
        }))
        //.pipe(eslint.format('junit', process.stdout))
        .pipe(eslint.failAfterError());
});

gulp.task('style', function () {
    return gulp.src('./js/**/*.js')
        .pipe(jscs({fix: false}))
        //.pipe(jscs.reporter())
        .pipe(jscs.reporter('failImmediately'))
        //.pipe(gulp.dest('js'));
});

gulp.task('js', ['clean'], function() {
    return gulp.src(includeJS)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build'))
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task("clean", function () {
    return del(['./build/**', '!./build']);
});

gulp.task('syntax', ['style', 'lint']);
gulp.task('build', ['js']);
gulp.task('default', ['build']);