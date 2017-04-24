require('chalk');
const fs = require('fs');
const semver = require('semver');
const _ = require('lodash');
//const textReplace = require('grunt-text-replace/lib/grunt-text-replace');

module.exports = function(grunt) {
	// Project configuration.

	var jsDocPath = '../../doc/<%= pkg.name %>/<%= pkg.version.replace(/.\\d+$/, "") %>/javascript',
		wpVersion = {},
		currentVersion = require('./package.json').version,
		lessFiles = [{
			expand: true,
			cwd: 'less/',
			src: ['*.less'],
			dest: 'css/',
			rename: (dst, src) => dst + src.replace(/\.less$/, '.min.css'),
		}],
		lesslint = {
			files: lessFiles,
			options: {
				csslint: {
					'box-sizing': false,
					'adjoining-classes': false,
					'qualified-headings': false,
					'universal-selector': false,
				},
			},
		};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				preserveComments: 'some',
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
						rename: (dst, src) => src.replace(/.js$/, '.min.js'),
					},
				],
			},
			noheader: {
				files: [
					{
						expand: true,
						src: ['ext/**/*.js', '!**/*.min.js'],
						cwd: '.',
						rename: (dst, src) => src.replace(/.js$/, '.min.js'),
					},
				],
			},
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: [{
					expand: true,
					cwd: 'templates/src',
					src: ['*.php'],
					dest: 'templates/dist',
				}],
			},
		},
		jsdoc : {
			dist : {
				src: ['js/*.js'],
				options: {
					private: true,
					destination: jsDocPath,
				},
			},
		},
		replace: {
			headers: {
				src: [
					'tests/**/*.js',
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
						to: '$1 <%= pkg.version %>',
					},
				],
			},
			readmeVersion: {
				src: 'readme.txt',
				overwrite: true,
				replacements: [
					{
						from: /Stable tag: \d+\.\d+\.\d+/,
						to: 'Stable tag: <%= pkg.version %>',
					},
					{
						from: /Tested up to: \d+\.\d+/,
						to: function(){
							var versionNumbers = fs.readFileSync('/var/www/wordpress/wp-includes/version.php', 'UTF-8').match(/^\$wp_version\s*=\s*'(\d+)\.(\d+)\.(\d+)';$/m).slice(1).map(Number);
							[wpVersion.major, wpVersion.minor, wpVersion.fix] = versionNumbers;
							return `Tested up to: ${wpVersion.major}.${wpVersion.minor}`;
						},
					},
				],
			},
		},
		lesslint: {
			info: _.merge({}, lesslint, {
				options: {
					failOnWarning: false,
				},
			}),
			strict: _.merge({}, lesslint, {
				options: {
					failOnWarning: true,
				},
			}),
		},
		less: {
			dist: {
				files: lessFiles,
				options: {
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: 'last 2 versions'}), // add vendor prefixes 
						new (require('less-plugin-clean-css'))({advanced: true}),
					],
				},
			},
		},
		eslint: {
			options: {
				format: 'stylish',//'node_modules/eslint-tap',
			},
			info_browser: {
				options: {
					configFile: 'eslint-browser.json',
					silent: true,
				},
				src: [
					'js/**.js',
					'!js/**.min.js',
				],
			},
			info_nodejs: {
				options: {
					configFile: 'eslint-nodejs.json',
					silent: true,
				},
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				],
			},
			strict_browser: {
				options: {
					configFile: 'eslint-browser.json',
				},
				src: [
					'js/**.js',
					'!js/**.min.js',
				],
			},
			strict_nodejs: {
				options: {
					configFile: 'eslint-nodejs.json',
					//				configFile: '.eslintrc.json',
				},
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				],
			},
		},
		phplint: {
			check: [
				'class/**/*.php',
				'*.php',
			],
		},
		docco: {
			debug: {
				src: [
					'js/**/*.js',
					'!js/**/*.min.js',
					'tests/**/*.js',
				],
				options: {
					output: `${jsDocPath}/docco`,
				},
			},
		},
		prompt: {
			upgrade: {
				options: {
					questions: [
						{
							config: 'bump.increment',
							type: 'list',
							message: 'Bump version from ' + '<%= pkg.version %>'.cyan + ' to:',
							choices: [
								{
									value: 'build',
									name: 'Build:  '.yellow + (currentVersion + '-?').yellow +
									' Unstable, betas, and release candidates.',
								},
								{
									value: 'patch',
									name: 'Patch:  '.yellow + semver.inc(currentVersion, 'patch').yellow +
									'   Backwards-compatible bug fixes.',
								},
								{
									value: 'minor',
									name: 'Minor:  '.yellow + semver.inc(currentVersion, 'minor').yellow +
									'   Add functionality in a backwards-compatible manner.',
								},
								{
									value: 'major',
									name: 'Major:  '.yellow + semver.inc(currentVersion, 'major').yellow +
									'   Incompatible API changes.',
								},
								{
									value: 'custom',
									name: 'Custom: ?.?.?'.yellow +
									'   Specify version...',
								},
							],
						},
						{
							config: 'bump.version',
							type: 'input',
							message: 'What specific version would you like',
							when: function (answers) {
								return answers['bump.increment'] === 'custom';
							},
							validate: function (value) {
								var valid = semver.valid(value) && true;
								return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' + 'http://semver.org/'.blue.underline + ' for more details.';
							},
						},
						{
							config: 'bump.files',
							type: 'checkbox',
							message: 'What should get the new version:',
							choices: [
								{
									value: 'package',
									name: 'package.json' + (!grunt.file.isFile('package.json') ? ' file not found, will create one'.grey : ''),
									checked: grunt.file.isFile('package.json'),
								},
								{
									value: 'bower',
									name: 'bower.json' + (!grunt.file.isFile('bower.json') ? ' file not found, will create one'.grey : ''),
									checked: grunt.file.isFile('bower.json'),
								},
								{
									value: 'git',
									name: 'git tag',
									checked: grunt.file.isDir('.git'),
								},
							],
						},
						{
							config: 'bump.changelogs',
							type: 'editor',
							message: 'What are the changes from v<%= pkg.version %> to put in "' + 'Changelogs'.green.bold + '" section ? ',
							validate: value => (value.length > 10 || ('The changelog section must be an ' + 'unordered list'.underline + ' of changed items. Please be more verbose').bold),
						},
						{
							config: 'bump.upgradeNotice',
							type: 'editor',
							message: 'What are the changes from v<%= pkg.version %> to put in "' + 'Upgrade Notice'.green.bold + '" section ? (optionnal)',
						},
					],
				},
			},
		},
	});

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-changed');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-lesslint');
	grunt.loadNpmTasks('gruntify-eslint');
	grunt.loadNpmTasks('grunt-phplint');
	grunt.loadNpmTasks('grunt-prompt');

	// Default task(s).
	grunt.registerTask('bumpVersionDo', '', function () {
		let version;
		if (grunt.config('bump.increment') === 'custom') {
			version = grunt.config('bump.version');
			grunt.log.ok('Bumping version to ' + version.yellow + ':');
		} else {
			version = semver.inc(currentVersion, grunt.config('bump.increment'));
			grunt.log.ok('Bumping up ' + grunt.config('bump.increment').yellow + ' version number.');
		}


		if (_(grunt.config('bump.files')).includes('package')) {
			grunt.log.ok('Updating ' + 'package.json'.yellow + '.');
			try {
				let thisPackage = require('package.json');
				if (typeof thisPackage.version != 'string')
					throw new TypeError('"package.json" should include a version number.');
				thisPackage.version = version;
				fs.writeFileSync('package.json', JSON.stringify(thisPackage, null, 2));
				grunt.log.ok('Updated "' + 'package.json'.green + '".');
			} catch(e) {
				grunt.log.error('Update of "' + 'package.json'.red + '" failed: ' + e.toString());
			}
		}
		process.exit();

		if (_(grunt.config('bump.files')).includes('bower')) {
			if (!grunt.file.isFile('bower.json')) {
				grunt.log.ok('Creating ' + 'bower.json'.yellow + '.');
			}
			grunt.log.ok('Updating ' + 'bower.json'.yellow + '.');
		}

		if (_(grunt.config('bump.files')).includes('git')) {
			grunt.log.ok('Updating ' + 'git tag'.yellow + '.');
		}
	});

	grunt.registerTask(
		'bumpVersion',
		[
			'prompt:upgrade',
			'bumpVersionDo',
		]
	);
	grunt.registerTask(
		'versionUpgrade',
		'Do the process to change version number',
		[
			'eslint:strict_browser',
			'eslint:strict_nodejs',
			'lesslint:strict',
			'bumpVersion',
			'changed:replace:headers',
			'replace:readmeVersion',
			'refreshResources',
			/* Add unit tests here */
		]
	);
	grunt.registerTask(
		'documentate',
		[
			'jsdoc',
			'docco',
		]
	);
	grunt.registerTask(
		'refreshStyles',
		[
			'lesslint:info',
			'less',
		]
	);
	grunt.registerTask(
		'refreshScripts',
		[
			'eslint:info_browser',
			'changed:uglify:header',
			'uglify:noheader', 
		]
	);
	grunt.registerTask(
		'refreshResources',
		[
			'refreshStyles',
			'refreshScripts',
			'htmlmin',
		]
	);
	grunt.registerTask(
		'lint',
		[
			'eslint:info_browser',
			'eslint:info_nodejs',
			'lesslint:info',
			'phplint',
		]
	);
};