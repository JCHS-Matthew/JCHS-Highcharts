
module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      babel: {
        options: {
          presets: ['env'] //compiles to JS compatible with most browsers (using browserslist default setting)
        },
        dist: {
          files: {
            "dist/JCHS-highcharts.js": "js/JCHS-highcharts.js"
          }
        }
      },
      uglify: {
        build: {
          src: 'dist/JCHS-highcharts.js',
          dest: 'dist/JCHS-highcharts.min.js'
        }
      },
      qunit: {
        files: ['test/*.html']
      },
      jshint: {
        // define the files to lint
        files: ['Gruntfile.js', 'js/*.js', 'test/**/*.js'],
        options: {
          asi: true, //supress warnings about missing semicolons
          esversion: 6, //allow ES6 syntax (will be compiled down to ~ES5 by Babel)
          globals: {
            jQuery: true,
          }
        }
      }
    });
  

  
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'babel', 'uglify']);
    grunt.registerTask('test', ['qunit']);

  };