module.exports = function(grunt) {
    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // 2. Configuration for concatinating files goes here
            dist: {
                src: [
                    // 'lib/*/*.js', // All JS in the libs folder
                    'js/*.js' // Custom JS
                ],
                dest: 'dist/js/production.js', // The production file
            }
        },
        uglify: {
            // Configuration for uglifying files goes here
            build: {
                src: 'dist/js/production.js', // Grab prod file from above
                dest: 'dist/js/production.min.js' // Minified output
            }
        },
        imagemin: {
            // Configuration for imagemin
            dynamic: {
                files: [{
                    expand: 'images/',
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'images/build/'
                }]
            }
        },
        sass: {
            dist: {
                // Compiles SASS
                options: {
                    style: 'compressed' // Minify CSS output
                },
                files: {
                    'dist/css/style.css': 'sass/style.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }, 
            css: {
                files: ['sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['*.html'],
                tasks: [],
                options: {
                    span: false
                }
            },
            options: {
                livereload: 5678,
            }
        },
        autoprefixer: {
            no_dest: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9']
                },
                src: 'dist/css/style.css'
            }
        }
    });
 
    // 3. Where we tell Grunt we plan to use this plug-in
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
 
    // 4. Where we tell Grunt what to do when we type "grunt"
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin','sass', 'watch', 'autoprefixer']);
}