var gulp = require('gulp');

var concat = require('gulp-concat');
var connect = require('gulp-connect');

var paths = {
    scripts: ['src/rama.prefix',
        'src/Constants.js',
        'src/RamaCore.js',
        'src/lib/**/*.js',
        'src/Api.js',
        'src/core/**/*.js',
        'src/components/**/*.js',
        'src/layouts/**/*.js',
        'src/rama.suffix'],
    skins: ['src/**/*.html', 'src/**/*.svg'],
    styles:'src/styles/**',
};

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
            .pipe(concat('rama.js'))
            .pipe(gulp.dest('build/'));
});


gulp.task('skins', function() {
    return gulp.src(paths.skins)
            .pipe(gulp.dest('build/'));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
            .pipe(gulp.dest('build/styles'));
});

gulp.task('connectDev', function () {
    connect.server({
        port: 8000
    });
});

gulp.task('pushToRamajsWebsite', function () {
    return gulp.src("build/**/*")
            .pipe(gulp.dest('../ramajs.org/build/lib/'));
});


gulp.task('default', ['skins', 'scripts', 'styles']);