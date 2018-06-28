// Gulp
var gulp = require('gulp');

// Sass/CSS stuff
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var header = require('gulp-header');

// Utilities
var bower = require('gulp-bower');
var fs = require('fs');
var fsPath = require('fs-path');
var exec = require('child_process').execSync;
var zip = require('gulp-zip');
var replace = require('gulp-replace');
var semver = require('semver');
var inquirer = require('inquirer');
var runSequence = require('run-sequence');


 
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
  gulp.src('bower_components/github-updater/**', {base: 'bower_components/'})
    .pipe(zip('github-updater.zip'))
    .pipe(gulp.dest('lib/plugins'));
});

// Compile Sass
gulp.task('sass', function() {
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var cssbanner = ['/*',
    'Theme Name:          '+pkg.themename,
    'Description:         '+pkg.description,
    'Author:              '+pkg.author,
    'Author URI:          '+pkg.authoruri,
    'Version:             '+pkg.version,
    'Theme URI:           '+pkg.homepage,
    'GitHub Theme URI:    '+pkg.homepage,
    'License:             '+pkg.license,
    'License URI:         '+pkg.licenseuri,
    '*/',
    ''].join('\n');

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

function getPackageJsonVersion() {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['copydeps', 'sass', 'watch']);

// Bump version
gulp.task('bump', function(callback){
    runSequence(
        'bump-version',
        'sass',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Files modified successfully, version bumped to '+getPackageJsonVersion());
            }
            callback(error);
        });
});
gulp.task('decompile', function(callback){
    var mapfiles = [
        './dist/theme-default/bootstrap.min.css.map',
        './dist/theme-default/toolkit.min.css.map',
        './dist/theme-default/jadu.min.css.map',
        './dist/theme-default/accommodation.min.css.map',
        './dist/theme-default/print.min.css.map',
        './dist/theme-default/google-map.min.css.map',
        './dist/theme-default/docs.min.css.map'
    ];
    for(var i = 0; i < mapfiles.length; i++ ) {
        var scss = JSON.parse(fs.readFileSync(mapfiles[i], 'utf8'));
        if(scss.sources.length){
            for(var j = 0; j < scss.sources.length; j++) {
                fsPath.writeFileSync('./scss/toolkit/'+scss.sources[j], scss.sourcesContent[j]);
            }
        }
    }
});