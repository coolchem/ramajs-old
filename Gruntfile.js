
'use strict';

var files = require('./ramaFiles.js').files;

module.exports = function(grunt) {

    //grunt plugins
    require('load-grunt-tasks')(grunt);

    var dist = 'rama';

    //config
    grunt.initConfig({
        concat: {
            rama: {
                src: files["rama"],
                dest: 'build/rama.js'
            }
        },

        connect: {
            devserver: {
                options: {
                    port: 8000,
                    hostname: '0.0.0.0',
                    base: '.',
                    keepalive: true
                }
            }
        },


        clean: {
            build: ['build'],
            tmp: ['tmp']
        },

        jshint: {
            options: {
                jshintrc: true
            }
        },

        build: {
            rama: {
                dest: 'build/rama.js',
                //src: util.wrap([files['angularSrc']], 'angular'),
                styles: {
                    css: ['css/angular.css'],
                    generateCspCssFile: true,
                    minify: true
                }
            }
        },


        min: {
            rama: 'build/rama.js'
        },

        "merge-conflict": {
            files: [
                'src/**/*',
                'test/**/*',
                'docs/**/*',
                'css/**/*'
            ]
        },

        copy: {

        },


        compress: {
            build: {
                options: {archive: 'build/' + dist +'.zip', mode: 'zip'},
                src: ['**'], cwd: 'build', expand: true, dot: true, dest: dist + '/'
            }
        },

        write: {
            versionTXT: {file: 'build/version.txt', val: "test"},
            versionJSON: {file: 'build/version.json', val: JSON.stringify("test")}
        },

        bump: {
            options: {
                files: ['package.json'],
                commit: false,
                createTag: false,
                push: false
            }
        }
    });

    //alias tasks
    grunt.registerTask('webserver', ['connect:devserver']);
    grunt.registerTask('concatRama', ['concat:rama']);

};
