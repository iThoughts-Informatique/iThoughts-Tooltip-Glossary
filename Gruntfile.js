module.exports = function(grunt) {
	// Project configuration.
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
					dest: 'templates/dist'
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
				src: ['js/**/*.js', '!**/*.min.js'],
				overwrite: true,
				replacements: [
					{
						from: /(@version) \d+\.\d+\.\d+/,
						to: '$1 <%= pkg.version %>'
					}
				]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-changed');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-text-replace');

	// Default task(s).
	grunt.registerTask('documentate', ['jsdoc']);
	grunt.registerTask('default', [
		'replace:headers',
		'uglify_separate', 
		'htmlmin'
	]);
	grunt.registerTask('uglify_separate', [
		'changed:uglify:header',
		'uglify:noheader'
	]);

};