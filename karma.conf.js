
module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],
    files: [
        'src/js/index.js',
        { pattern: 'node_modules/angular-mocks/angular-mocks.js', watch: false },
        'src/js/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],

    // web server port
    port: 9876,
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // plugins: [
    //     'karma-chrome-launcher',
    //     'karma-jasmine',
    //     'karma-ng-html2js-preprocessor',
    //     'karma-browserify'
    // ],

    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
