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
import minifyHtml from 'gulp-minify-html';
import ngTemplateCache from 'gulp-angular-templatecache';
import browserSync from 'browser-sync';

const appName = 'textReverser';

/**
 * @desc Grab all newly created files and injectop
 * all of them into the new index.html
 */
gulp.task('build', buildIndexHtml);

function buildIndexHtml() {
    const buildSources = gulp.src([
        './build/app-*.js',
        './build/templates-*.js',
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
            entry: './src/js/index.js',
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
            moduleName: 'wordsmith',
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
 * @desc Minify and create $templateCache from the html templates
 * When using minifyHtml I can make sure all comments the team has made in our
 * source code will not be pushed out to production.
 */
gulp.task('templates', () => {
  return del('./build/templates*.js').then(() => {
    gulp.src(['./src/js/**/*.html'])
      .pipe(minifyHtml({
        empty: true,
        spare: true
      }))
      .pipe(ngTemplateCache({module: appName}))
      .pipe(rev()) // Add unique name
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
  gulp.watch(['./src/js/**/*.html'], ['templates']);
});

gulp.task('init', ['js', 'templates', 'sass-init']);
gulp.task('prod', ['js', 'templates', 'sass-prod']);
