// ////////////////////////////////////////////////
//
// EDIT CONFIG OBJECT BELOW !!!
// 
// buildFilesFoldersRemove => list of files to remove when running final build
// // /////////////////////////////////////////////

var config = {
	buildFilesFoldersRemove : [
		'build/client/scss',
		'build/client/js/!(*.min.js)',
		'build/client/maps',
		'build/package.json',
		'build/bower.json',
		'build/gulpfile.js'
	]
};

// ////////////////////////////////////////////////
// Require
// // /////////////////////////////////////////////

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	nodemon = require('gulp-nodemon'),
	env = require('gulp-env'),
	del = require('del');

// ////////////////////////////////////////////////
// Log Errors
// // /////////////////////////////////////////////

function errorlog (err) {
	console.log(err.message);
	this.emit('end');
}

// ////////////////////////////////////////////////
// Scripts Tasks
// // /////////////////////////////////////////////

gulp.task('scripts', function () {
	return gulp.src('client/js/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(concat('temp.js'))
			.pipe(uglify())
			.on('error', errorlog)
			.pipe(rename('app.min.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('client/js/'))
		.pipe(reload({stream : true}));
});

// ////////////////////////////////////////////////
// Style Tasks
// // /////////////////////////////////////////////

gulp.task('styles', function () {
	gulp.src('client/scss/style.scss')
		.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}))
			.on('error', errorlog)
			.pipe(autoprefixer({
	            browsers: ['last 3 versions'],
	            cascade: false
	        }))	
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('client/css'))
		.pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// HTML Tasks
// // /////////////////////////////////////////////

gulp.task('html', function(){
    gulp.src('client/**/*.html')
    	.pipe(reload({stream:true}));
});

// ////////////////////////////////////////////////
// Nodemon Tasks
// // /////////////////////////////////////////////

gulp.task('nodemon', function (cb) {
	var started = false;

	env({
	    file: "env.json"
	});
	
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task('build:nodemon', function (cb) {
	var started = false;

	env({
	    file: "env.json"
	});
	
	return nodemon({
		script: 'build/server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

// ////////////////////////////////////////////////
// Browser Sync Tasks
// // /////////////////////////////////////////////

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: "http://localhost:3000",
        port: 7000
    });
});

// task to run build server for testing final app
gulp.task('build:serve', ['build:nodemon'], function() {
    browserSync({
        proxy: "localhost:3000",
        port: 8000
    });
});

// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('./**/*/')
    	.pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);

// ////////////////////////////////////////////////
// Watch Tasks
// // /////////////////////////////////////////////

gulp.task ('watch', function(){
	gulp.watch('client/scss/**/*.scss', ['styles']);
	gulp.watch('client/js/**/*.js', ['scripts']);
  	gulp.watch('client/**/*.html', ['html']);
});


// ////////////////////////////////////////////////
// Default Tasks
// // /////////////////////////////////////////////

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);

