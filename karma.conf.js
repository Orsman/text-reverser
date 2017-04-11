
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    
    files: [
        'src/js/*.spec.js'
    ],

    preprocessors: {
      'src/js/**/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: ['babelify']
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
