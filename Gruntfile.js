
module.exports = function (grunt) {

  require("load-grunt-tasks")(grunt) //loads all Grunt NpmTasks automatically

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* ESLint */
    // lint our JS
    eslint: {
      options: {
        "extends": "eslint:recommended",
        "rules": {
          // enable additional rules
          "indent": ["warn", 2],
          "semi": ["warn", "never"],
          "valid-jsdoc": "warn",
          "no-confusing-arrow": "warn",
          "no-magic-numbers": "off",
        },
        "maxWarnings": 20,
      },
      target: ['Gruntfile.js', 'src/js/*.js', 'test/*.js']
    },

    /* Babel */
    // transpile our JS (which uses new ES6 syntax) down to older, more browser compatible JS syntax
    babel: {
      options: {
        presets: ['env'] //compiles to JS compatible with most browsers (using browserslist default setting)
      },
      dist: {
        files: {
          //'build/JCHS-highcharts.transpiled.js': 'src/js/JCHS-highcharts.js'
          'dist/JCHS-highcharts.js': 'src/js/JCHS-highcharts.js'
        }
      }
    },

    /* Browserify */
    // bundle all JS into one file (JHCS, Highcharts, and jQuery)
    browserify: {
      dist: {
        src: 'build/JCHS-highcharts.transpiled.js',
        dest: 'dist/JCHS-highcharts.js'
      }
    },

    /* PostCSS */
    // Stylelint, PostCS Preset Env, Autoprefixer, CSSNano 
    // lint, transpile, add vendor prefixes, and minify CSS
    postcss: {
      options: {
        map: false,
        processors: [
          require("stylelint")({ //linting 
            "rules": {
              "block-no-empty": true,
              "color-no-invalid-hex": true,
              "comment-empty-line-before": [ "always", { "ignore": ["stylelint-commands", "after-comment"] } ],
              "declaration-colon-space-after": "always",
              "indentation": [2],
              "max-empty-lines": 2,
              "rule-empty-line-before": [ "always", { "except": ["first-nested"], "ignore": ["after-comment"] } ]
            }
          }),
          //require('postcss-import'), //bundle imported CSS...would create redundancy on pages with more than one chart
          require('postcss-preset-env'), //polyfill any new CSS features
          require('autoprefixer'), //add vendor prefixes
          require('cssnano')() // minify the result
        ],
      },
      dist: {
        src: 'src/css/*.css',
        dest: 'dist/JCHS-highcharts.min.css'
      }
    },

    /* Karma */
    //cross-browser unit testing
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    /* Uglify */
    //minify the final JS file
    uglify: {
      build: {
        src: 'dist/JCHS-highcharts.js',
        dest: 'dist/JCHS-highcharts.min.js'
      }
    },

    jsdoc: {
      dist: {
        src: ['src/js/*.js', 'README.md'],
        options: {
          destination: 'docs',
          template: "node_modules/minami"
        }
      }
    }
  })

  // name the tasks 
  grunt.registerTask('default', ['eslint', 'babel', 'uglify',  'postcss', /*'browserify',*/ 'karma', 'jsdoc'])
  grunt.registerTask('test', ['karma'])
  grunt.registerTask('css', ['postcss'])
  grunt.registerTask('js', ['eslint', 'jsdoc', 'babel', 'uglify'])

}