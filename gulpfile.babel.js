'use strict';

import gulp from 'gulp';
import del from 'del';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buffer from 'gulp-buffer';
import annotate from 'gulp-ng-annotate';

import rev from 'gulp-rev';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import inject from 'gulp-inject';
import minifyCSS from 'gulp-minify-css';
import browserSync from 'browser-sync';

const appName = 'wordsmith.textReverser';

/**
 * @desc Grab all newly created files and injectop
 * all of them into the new index.html
 */
gulp.task('build', buildIndexHtml);

function buildIndexHtml() {
    const buildSources = gulp.src([
        './build/app-*.js',
        './build/style*.css'
    ]);

    return gulp.src('./src/index.html')
        .pipe(inject(buildSources, {
            addRootSlash: false,
            ignorePath: 'build'
        }))
        .pipe(gulp.dest('./build'))
        .on('end', browserSync.reload);
}

/**
 * @desc Minify and bundle the app's JavaScript
 */
gulp.task('js', () => {
    return del('./build/app*.js').then(() => {
        return rollup({
            entry: './src/js/app.js',
            plugins: [
                resolve(),
                commonjs(),
                babel({
                    presets: [
                        [
                            "es2015", {
                                "modules": false
                            }
                        ]
                    ],
                    babelrc: false,
                    exclude: 'node_modules/**'
                })
            ],
            format: 'umd',
            globals: {
                angular: 'angular'
            }
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(annotate())
        .pipe(rev())
        .pipe(gulp.dest('./build'))
        .on('end', buildIndexHtml);
    });
});

/**
 * @desc Minify and bundle the app's CSS
 */
gulp.task('sass', () => {
  return del('./build/style*.css').then(() => {
    gulp.src('./src/styles/style.scss')
      .pipe(sass())
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
  });
});

/**
 * @desc Minify and bundle the app's CSS
 */
gulp.task('sass-init', () => {
  return del('./build/style*.css').then(() => {
    gulp.src('./src/styles/style.scss')
      .pipe(sass())
      .pipe(gulp.dest('./build'))
      .on('end', buildIndexHtml);
  });
});

gulp.task('sass-prod', () => {
  return del('./build/style*.css').then(() => {
    gulp.src('./src/styles/style.scss')
      .pipe(sass())
      .pipe(minifyCSS())
      .pipe(rev())
      .pipe(gulp.dest('./build'))
      .on('end', buildIndexHtml);
  });
});

/**
 * @desc Watch files and build
 */
gulp.task('watch', ['init'], () => {
    browserSync.init({
        server: "./build"
    });

  gulp.watch('./src/styles/**/*.scss', ['sass']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
});

gulp.task('init', ['js', 'sass-init']);
gulp.task('prod', ['js', 'sass-prod']);
