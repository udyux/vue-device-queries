const gulp = require('gulp')
const uglify = require('gulp-uglify')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const babel = require('rollup-plugin-babel')
const rollup = require('gulp-better-rollup')
const sourcemaps = require('gulp-sourcemaps')
const cjsResolve = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const config = {
  src: 'src/*.js',
  dist: 'dist',
	watch: 'src/**/*.js',
	eslint: { fix: true },
	babel: { presets: ['es2015-rollup'] }
}

gulp.task('js', () =>
	gulp.src(config.src)
		.pipe(plumber(function(e) {
			console.log(e)
			this.emit('end')
		}))
		.pipe(sourcemaps.init())
		.pipe(eslint(config.eslint))
		.pipe(eslint.format())
		.pipe(rollup({
			plugins: [
				cjsResolve(),
				nodeResolve(),
				babel(config.babel)
			]
		}, 'iife'))
		.pipe(sourcemaps.write())
		.pipe(rename({
			dirname: '',
			basename: 'vue-device-queries'
		}))
		.pipe(gulp.dest(config.dist)))

gulp.task('build', ['js'], () =>
	gulp.src(config.src)
		.pipe(eslint(config.eslint))
		.pipe(eslint.format())
		.pipe(rollup({
			plugins: [
				cjsResolve(),
				nodeResolve(),
				babel(config.babel)
			]
		}, 'iife'))
		.pipe(uglify())
		.pipe(rename({
			dirname: '',
			basename: 'vue-device-queries',
			suffix: '.min'
		}))
		.pipe(gulp.dest(config.dist)))

gulp.task('dev', ['js'], () => {
	gulp.watch(config.watch, ['js'])
})
