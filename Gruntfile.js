module.exports = function(grunt) {
	// Project configuration.

	const lessFiles = [{
		expand: true,
		cwd: 'less/',
		src: ['*.less'],
		dest: 'css/',
		rename: (dst, src) => dst + src.replace(/\.less$/, '.min.css')
	}];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				preserveComments: 'some'
			},
			header: {
				options: {
					banner: '/*! <%= pkg.name %> build on <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> for v<%= pkg.version %> */',
					sourceMap: false,
					footer: '/**/',
				},
				files: [
					{
						expand: true,
						src: ['js/**/*.js', '!**/*.min.js'],
						cwd: '.',
						rename: (dst, src) => src.replace(/.js$/, '.min.js')
					},
				]
			},
			noheader: {
				files: [
					{
						expand: true,
						src: ['ext/**/*.js', '!**/*.min.js'],
						cwd: '.',
						rename: (dst, src) => src.replace(/.js$/, '.min.js')
					},
				]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: 'templates/src',
					src: ['*.php'],
					dest: 'templates/dist',
				}]
			},
		},
		jsdoc : {
			dist : {
				src: ['js/*.js'],
				options: {
					private: true,
					destination: '../../doc/<%= pkg.name %>/<%= pkg.version.replace(/.\\d+$/, "") %>/javascript/'
				}
			}
		},
		replace: {
			headers: {
				src: [
					'js/**/*.js',
					'!js/**/*.min.js',
					'less/**/*.less',
					'class/**/*.php',
					'templates/src/*.php',
				],
				overwrite: true,
				replacements: [
					{
						from: /(@version) \d+\.\d+\.\d+/,
						to: '$1 <%= pkg.version %>'
					}
				]
			}
		},
		lesslint: {
			dist: {
				files: lessFiles,
				options: {
					csslint: {
						'box-sizing': false,
						'adjoining-classes': false,
					},
					failOnWarning: false
				}
			}
		},
		less: {
			dist: {
				files: lessFiles,
				options: {
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: 'last 2 versions'}), // add vendor prefixes 
						new (require('less-plugin-clean-css'))({advanced: true}),
					]
				}
			}
		},
		eslint: {
			options: {
				silent: true,
			},
			browser: {
				options: {
					configFile: ".eslintrc.json",
				},
				src: [
					'js/**.js',
					'!js/**.min.js',
				]
			},
			nodejs: {
				options: {
					//				configFile: ".eslintrc.json",
				},
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				]
			},
		},
		phplint: {
			check: [
				"class/**/*.php",
				"class/**/*.php",
			],
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-changed');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-lesslint');
	grunt.loadNpmTasks("gruntify-eslint");
	grunt.loadNpmTasks("grunt-phplint");

	// Default task(s).
	grunt.registerTask('documentate', ['jsdoc']);
	grunt.registerTask('refreshStyles', ['lesslint', 'less']);
	grunt.registerTask('default', [
		'changed:replace:headers',
		'uglifySeparate', 
		'htmlmin'
	]);
	grunt.registerTask('uglifySeparate', [
		'eslint:browser',
		'changed:uglify:header',
		'uglify:noheader'
	]);
	grunt.registerTask('lint', [
		'eslint:browser',
		'eslint:nodejs',
		'phplint',
		'lesslint'
	])

};