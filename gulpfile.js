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
var zip = require('gulp-zip');
var replace = require('gulp-replace');

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

// package plugins
gulp.task('package-plugins', function() {
  gulp.src('lib/plugins/toolkit-events/**/*', {base: 'lib/plugins'})
    .pipe(zip('toolkit-events.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('lib/plugins/toolkit-news/**/*', {base: 'lib/plugins'})
    .pipe(zip('toolkit-news.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('lib/plugins/toolkit-profiles/**/*', {base: 'lib/plugins'})
    .pipe(zip('toolkit-profiles.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('lib/plugins/toolkit-shortcodes/**/*', {base: 'lib/plugins'})
    .pipe(zip('toolkit-shortcodes.zip'))
    .pipe(gulp.dest('lib/plugins'));
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

// update version number in lib/admin.php
gulp.task('bumpversion', function() {
  gulp.src(['lib/admin.php'])
    .pipe(replace(/version = "[0-9\.]+"/g, 'version = "'+pkg.version+'"'))
    .pipe(gulp.dest('lib'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['copydeps', 'sass', 'watch']);

// Bump version
gulp.task('bump', ['sass', 'bumpversion']);