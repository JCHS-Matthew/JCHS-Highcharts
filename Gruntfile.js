
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
      }
    });
  

  
    // Default task(s).
    grunt.registerTask('default', ['babel', 'uglify']);
  
  };