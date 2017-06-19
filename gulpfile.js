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
var semver = require('semver');
var inquirer = require('inquirer');
var git = require('gulp-git');

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
gulp.task('package-plugins', ['bower'], function() {
  gulp.src('bower_components/toolkit-events/**', {base: 'bower_components/'})
    .pipe(zip('toolkit-events.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('bower_components/toolkit-news/**', {base: 'bower_components/'})
    .pipe(zip('toolkit-news.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('bower_components/toolkit-profiles/**', {base: 'bower_components/'})
    .pipe(zip('toolkit-profiles.zip'))
    .pipe(gulp.dest('lib/plugins'));
  gulp.src('bower_components/toolkit-shortcodes/**', {base: 'bower_components/'})
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

// update version number in package.json
gulp.task('bump-version', function() {
    var oldVersion = getPackageJsonVersion(),
    newVersion,
    questions = [
      {
        name:    'increment',
        type:    'rawlist',
        default: 'patch',
        message: 'Bump version from ' + oldVersion + ' to:',
        choices: [
          {
            key:   'p',
            value: 'patch',
            name:  'Patch:  ' + semver.inc(oldVersion, 'patch') + ' Backwards-compatible bug fixes.'
          },
          {
            key:   'm',
            value: 'minor',
            name:  'Minor:  ' + semver.inc(oldVersion, 'minor') + ' Add functionality in a backwards-compatible manner.'
          },
          {
            key:   'v',
            value: 'major',
            name:  'Major:  ' + semver.inc(oldVersion, 'major') + ' Incompatible API changes.'
          },
          {
            key:   'c',
            value: 'custom',
            name:  'Custom: ?.?.? Specify version...'
          }
        ]
      },
      {
        name:     'customversion',
        type:     'input',
        message:  'What specific version would you like',
        when:     function (answers) {
          return answers.increment === 'custom';
        },
        validate: function (value) {
          var valid = semver.valid(value);
          return !!valid || 'Must be a valid semver, such as 1.2.3-rc1. See http://semver.org/ for more details.';
        }
      }
    ];
    return inquirer.prompt(questions).then(function (answers) {
        if (answers.increment === 'custom') {
            newVersion = answers.customversion;
        } else {
            newVersion = semver.inc(oldVersion, answers.increment)
        }
        console.log('Changing version to: '+newVersion);
        // replace version number in key files
        var filesWithVersions = [
          'lib/admin.php',
          'package.json'
        ];
        gulp.src(filesWithVersions, {base: './'})
          .pipe(replace(oldVersion, newVersion))
          .pipe(gulp.dest('./'));
    });
});


gulp.task('commit-changes', function () {
  var version = getPackageJsonVersion();
  return gulp.src('.')
    .pipe(git.commit('Tagging new release: '+version, {args: '-a'}));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'develop', cb);
});

gulp.task('merge-to-master', function(cb){
  git.checkout('master');
  git.merge('develop')
});

gulp.task('checkout-develop', function(cb){
  git.checkout('develop');
});

// creates a new tag
gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });
});

function getPackageJsonVersion() {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

gulp.task('release', function (callback) {
  runSequence(
    'checkout-develop',
    'bump-version',
    'commit-changes',
    'push-changes',
    'merge-to-master',
    'create-new-tag',
    'checkout-develop',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['copydeps', 'sass', 'watch']);

// Bump version
gulp.task('bump', ['sass', 'bumpversion']);