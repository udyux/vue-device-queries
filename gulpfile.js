const gulp = require('gulp')
const uglify = require('gulp-uglify')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const rollup = require('gulp-better-rollup')
const sourcemaps = require('gulp-sourcemaps')
const version = require('./package.json').version

const plugins = [
	require('rollup-plugin-commonjs')(),
	require('rollup-plugin-node-resolve')({ module: true }),
	require('rollup-plugin-babel')({ presets: ['es2015-rollup'] })
]

const config = {
  entry: 'src/index.js',
	output: 'vue-device-queries',
	distFolder: 'dist',
	watch: 'src/**/*.js',
	eslint: { fix: true },
	rollup: {
		format: 'umd',
		name: 'DeviceQueries',
		banner: `/*! vue-device-queries v${version} | Licence: MIT (c) Nicolas Udy */`
	}
}

// dev build
gulp.task('js', () =>
	gulp.src(config.entry)
		.pipe(plumber(function(e) {
			console.log(e)
			this.emit('end')
		}))
		.pipe(rename({
			dirname: '',
			basename: config.output
		}))
		.pipe(eslint(config.eslint))
		.pipe(eslint.format())
		.pipe(sourcemaps.init())
		.pipe(rollup({ plugins }, config.rollup))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.distFolder)))

// production build
gulp.task('build', ['js'], () =>
	gulp.src(`${config.distFolder}/${config.output}.js`)
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify({
			output: { comments: /^\!/ }
		}))
		.pipe(gulp.dest(config.distFolder)))

// dev watch task
gulp.task('dev', ['js'], () => {
	gulp.watch(config.watch, ['js'])
})
