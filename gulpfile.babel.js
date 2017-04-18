'use strict';

const appName = 'textReverser';

import gulp from 'gulp';
import del from 'del';
import karma from 'karma';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buffer from 'gulp-buffer';
import annotate from 'gulp-ng-annotate';
import express from 'express';
import rev from 'gulp-rev';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import inject from 'gulp-inject';
import minifyCSS from 'gulp-minify-css';
import minifyHtml from 'gulp-minify-html';
import ngTemplateCache from 'gulp-angular-templatecache';

const app = express();
app.use(express.static('./build'));

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
        .pipe(gulp.dest('./build'));
}

gulp.task('build', buildIndexHtml);

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

gulp.task('sass', () => {
  return del('./build/style*.css').then(() => {
    gulp.src('./src/styles/style.scss')
      .pipe(sass())
      .pipe(gulp.dest('./build'));
  });
});

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

gulp.task('templates', () => {
  return del('./build/templates*.js').then(() => {
    gulp.src(['./src/js/**/*.html'])
      .pipe(minifyHtml({
        empty: true,
        spare: true
      }))
      .pipe(ngTemplateCache({module: appName}))
      .pipe(rev())
      .pipe(gulp.dest('./build'))
      .on('end', buildIndexHtml);
  });
});

gulp.task('test', (done) => {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});


gulp.task('start', ['init'], (done) => {

    app.listen(3000, () => {
       console.log('Server running at http://localhost:3000');
    });

});

gulp.task('watch', ['init'], () => {

    app.listen(3000, () => {
       console.log('Server running at http://localhost:3000');
    });

    gulp.watch('./src/styles/**/*.scss', ['sass']);
    gulp.watch(['./src/js/**/*.js'], ['js']);
    gulp.watch(['./src/js/**/*.html'], ['templates']);
});

gulp.task('init', ['js', 'templates', 'sass-init']);
gulp.task('prod', ['js', 'templates', 'sass-prod']);
