// Gulp
var gulp = require('gulp');

// Sass/CSS stuff
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var header = require('gulp-header');

// Utilities
var bower = require('gulp-bower');
var fs = require('fs');
var exec = require('child_process').execSync;

// read package.json
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var cssbanner = ['/*',
  'Theme Name:          '+pkg.themename,
  'Description:         '+pkg.description,
  'Author:              '+pkg.author,
  'Author URI:          '+pkg.authoruri,
  'Version:             '+pkg.version,
  'Theme URI:           '+pkg.homepage,
  'Bitbucket Theme URI: '+pkg.homepage,
  'License:             '+pkg.license,
  'License URI:         '+pkg.licenseuri,
  '*/',
  ''].join('\n');

 
gulp.task('bower', function() {
    return bower({ cmd: 'update'});
});

gulp.task('copydeps', ['bower'], function() {
    gulp.src('bower_components/tmhOAuth/cacert.pem')
        .pipe(gulp.dest('./lib/'));
    gulp.src('bower_components/tmhOAuth/tmhOAuth.php')
        .pipe(gulp.dest('./lib/'));
    gulp.src('bower_components/TGM-Plugin-Activation/class-tgm-plugin-activation.php')
        .pipe(gulp.dest('./lib/'));
});

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/style.scss')
        .pipe(sass({
            includePaths: ['./scss'],
            outputStyle: 'expanded'
        }))
        .pipe(cleanCSS())
        .pipe(header(cssbanner, {pkg: pkg}))
        .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['copydeps', 'sass', 'watch']);