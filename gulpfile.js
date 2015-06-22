var gulp=require('gulp');
var plumber=require('gulp-plumber');
var jade=require('gulp-jade');
var sourcemaps=require('gulp-sourcemaps');
var less=require('gulp-less');
var autoprefixer=require('gulp-autoprefixer');
var minifyCss=require('gulp-minify-css');
var uglify=require('gulp-uglify');

var htmlSrc='src/index.jade';
var cssSrc='src/index.less';
var jsSrc='src/index.js';

gulp.task('html',function(){
	gulp.src(htmlSrc)
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('public_html'));
});

gulp.task('css',function(){
	gulp.src(cssSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(minifyCss({compatibility:'ie7'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public_html'));
});

gulp.task('js',function(){
	gulp.src(jsSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public_html'));
});

gulp.task('watch',function(){
	gulp.watch(htmlSrc,['html']);
	gulp.watch(cssSrc,['css']);
	gulp.watch(jsSrc,['js']);
});

gulp.task('default',['html','css','js']);
