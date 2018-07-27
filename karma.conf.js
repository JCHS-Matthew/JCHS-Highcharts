// Karma configuration
// Generated on Thu Jul 12 2018 14:06:00 GMT-0400 (Eastern Daylight Time)
//const path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    //basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],


    // list of files / patterns to load in the browser
    files: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
      'dist/JCHS-highcharts.js',
      'test/*.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //use karma-babel-preprocessor ?
    },

    // web server port
    port: 9999,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', /*'Firefox',*/ 'Safari', 'PhantomJS', /*'IE'*/],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html', 'coverage'],
 
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'dist/JCHS-highcharts.js': ['coverage']
    },
 
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'test-results/code-coverage'
    },
 
    htmlReporter: {
      outputFile: 'test-results/unit-test-results.html',
            
      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: 'JCHS-highcharts',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true
    },
  })
}
