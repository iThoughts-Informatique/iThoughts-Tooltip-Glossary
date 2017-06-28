const chalk = require( 'chalk' );
const fs = require( 'fs' );
const semver = require( 'semver' );
const _ = require( 'lodash' );
//const textReplace = require('grunt-text-replace/lib/grunt-text-replace');

module.exports = function gruntInit( grunt ) {
	// Project configuration.

	var jsDocPath = 'docs/javascript',
		wpVersion = {},
		currentVersion = require( './package.json' ).version,
		lessFiles = [{
			expand: true,
			cwd:    'less/',
			src:    [ '*.less' ],
			dest:   'css/',
			rename: ( dst, src ) => dst + src.replace( /\.less$/, '.min.css' ),
		}],
		lesslint = {
			files:   lessFiles,
			options: {
				csslint: {
					'box-sizing':         false,
					'adjoining-classes':  false,
					'qualified-headings': false,
					'universal-selector': false,
				},
			},
		},
		gruntLocalconfig = require('./grunt_localconfig.json');

	const gruntConfig = {
		pkg:    grunt.file.readJSON( 'package.json' ),
		uglify: {
			options: {
				preserveComments: 'some',
			},
			header: {
				options: {
					banner:    '/*! <%= pkg.name %> build on <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> for v<%= pkg.version %> */',
					sourceMap: false,
					footer:    '/**/',
				},
				files: [
					{
						expand: true,
						src:    [
							'js/dist/**.js',
							'!js/dist/**.min.js',
						],
						rename: ( dst, src ) => src.replace( /.js$/, '.min.js' ),
					},
				],
			},
			noheader: {
				files: [
					{
						expand: true,
						src:    [ 'ext/**/*.js', '!**/*.min.js' ],
						cwd:    '.',
						rename: ( dst, src ) => src.replace( /.js$/, '.min.js' ),
					},
				],
			},
		},
		htmlmin: {
			dist: {
				options: {
					removeComments:     true,
					collapseWhitespace: true,
				},
				files: [{
					expand: true,
					cwd:    'templates/src',
					src:    [ '*.php' ],
					dest:   'templates/dist',
				}],
			},
		},
		jsdoc: {
			dist: {
				src:     [ 'js/*.js' ],
				options: {
					private:     true,
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
				overwrite:    true,
				replacements: [
					{
						from: /(@version) \d+\.\d+\.\d+/,
						to:   '$1 <%= pkg.version %>',
					},
				],
			},
			readmeVersion: {
				src:          'readme.txt',
				overwrite:    true,
				replacements: [
					{
						from: /Stable tag: \d+\.\d+\.\d+/,
						to:   'Stable tag: <%= pkg.version %>',
					},
					{
						from: /Tested up to: \d+\.\d+/,
						to:   function to() {
							const wpVersionFile = require('path').resolve(
								gruntLocalconfig.wordpress_base_path,
								'wp-includes/version.php'
							);
							const wpVersionFileContent = fs.readFileSync(
								wpVersionFile,
								'UTF-8'
							);
							var versionNumbers = wpVersionFileContent.match( /^\$wp_version\s*=\s*'(\d+)\.(\d+)(?:\.(\d+))?';$/m ).slice( 1 ).map( Number );
							[ wpVersion.major, wpVersion.minor, wpVersion.fix ] = versionNumbers;
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
				files:   lessFiles,
				options: {
					plugins: [
						new ( require( 'less-plugin-autoprefix' ))({
							browsers: 'last 2 versions',
						}), // add vendor prefixes
						new ( require( 'less-plugin-clean-css' ))({
							advanced: true,
						}),
					],
				},
			},
		},
		eslint: {
			options: {
				format: 'stylish',
				fix:			true,
				useEslintrc:	false,
			},
			info_browser: {
				options: {
					configFile: 'lint/eslint-browser.json',
					silent:     true,
					fix:		true,
				},
				src: [
					'js/src/**.js',
					'!js/src/**.min.js',
				],
			},
			info_nodejs: {
				options: {
					configFile: 'lint/eslint-nodejs.json',
					silent:     true,
					fix:		true,
				},
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				],
			},
			strict_browser: {
				options: {
					configFile: 'lint/eslint-browser.json',
				},
				src: [
					'js/src/**.js',
					'!js/src/**.min.js',
				],
			},
			strict_nodejs: {
				options: {
					configFile: 'lint/eslint-nodejs.json',
				},
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				],
			},
		},
		babel: {
			options: {
				sourceMap: true,
				presets:   [ 'es2015' ],
			},
			dist: {
				files: [{
					expand: true,
					cwd : 'js/src',
					src:    [
						'**/*.js',
						'!**/*.min.js',
					],
					dest: 'js/dist',
					ext:  '.js',
				}],
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
					'js/*.js',
					'!js/*.min.js',
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
							config:  'bump.increment',
							type:    'list',
							message: 'Bump version from ' + '<%= pkg.version %>'.cyan + ' to:',
							choices: [
								{
									value: 'build',
									name:  `${chalk.yellow(`Build:  ${currentVersion}-?` )} > Unstable, betas, and release candidates.`,
								},
								{
									value: 'patch',
									name:  `${chalk.yellow(`Patch:  ${semver.inc( currentVersion, 'patch' )}` )}   > Backwards-compatible bug fixes.`,
								},
								{
									value: 'minor',
									name:  `${chalk.yellow(`Minor:  ${semver.inc( currentVersion, 'minor' )}` )}   > Add functionality in a backwards-compatible manner.`,
								},
								{
									value: 'major',
									name:  `${chalk.yellow(`Major:  ${semver.inc( currentVersion, 'major' )}` )}   > Incompatible API changes.`,
								},
								{
									value: 'custom',
									name:  `${chalk.yellow(`Custom: ?.?.?` )}   > Specify version...`,
								},
							],
						},
						{
							config:  'bump.version',
							type:    'input',
							message: 'What specific version would you like',
							when:    function when( answers ) {
								return 'custom' === answers['bump.increment'];
							},
							validate: function validate( value ) {
								var valid = semver.valid( value ) && true;
								return valid || `Must be a valid semver, such as 1.2.3-rc1. See ${chalk.blue.underline('http://semver.org/')} for more details.`;
							},
						},
						{
							config:  'bump.files',
							type:    'checkbox',
							message: 'What should get the new version:',
							choices: [
								{
									value:   'package',
									name:    'package.json' + ( !grunt.file.isFile( 'package.json' ) ? chalk.grey(' file not found, will create one') : '' ),
									checked: grunt.file.isFile( 'package.json' ),
								},
								{
									value:   'bower',
									name:    'bower.json' + ( !grunt.file.isFile( 'bower.json' ) ? chalk.grey(' file not found, will create one') : '' ),
									checked: grunt.file.isFile( 'bower.json' ),
								},
								{
									value:   'git',
									name:    'git tag',
									checked: grunt.file.isDir( '.git' ),
								},
							],
						},
						/*						{
							config:   'bump.changelogs',
							type:     'editor',
							message:  `What are the changes from v<%= pkg.version %> to put in "${chalk.green.bold('Changelogs')}" section ? `,
							validate: value => ( value.length > 10 || chalk.bold(`The changelog section must be an ${chalk.underline('unordered list')} of changed items. Please be more verbose` ) ),
						},
						{
							config:  'bump.upgradeNotice',
							type:    'editor',
							message: `What are the changes from v<%= pkg.version %> to put in "${chalk.green.bold('Upgrade Notice')}" section ? (optionnal)`,
						},*/
					],
				},
			},
		},
		phpdoc: {
			dist: {
				options: {
					verbose: true
				},
				src: [
					'class/**/*.php',
					'*.php',
				],
				dest: 'docs/php',
			}
		},
		wp_readme_to_markdown: {
			dist: {
				files: {
					'readme.md': 'readme.txt'
				},
			},
		},
	};
	if(typeof gruntLocalconfig !== 'undefined' && typeof gruntLocalconfig.svn_path !== 'undefined'){
		gruntConfig.rsync = {
			svn: {
				options: {
					src: '.',
					dest: require('path').resolve(gruntLocalconfig.svn_path, 'trunk'),
					deleteAll: true,
					exclude: [
						'.*',
						'node_modules',
						'test',
						'templates/src',
						'lint',
						'*.log',
						'docs',
						'Gruntfile.js',
						'grunt_localconfig.json',
						'package-lock.json',
						'less'
					],
					recursive: true,
				},
			},
		};
	}
	grunt.initConfig(gruntConfig);

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-changed' );
	grunt.loadNpmTasks( 'grunt-jsdoc' );
	grunt.loadNpmTasks( 'grunt-docco' );
	grunt.loadNpmTasks( 'grunt-lesslint' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-phplint' );
	grunt.loadNpmTasks( 'grunt-prompt' );
	grunt.loadNpmTasks( 'grunt-phpdoc' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'grunt-rsync' );
	grunt.loadNpmTasks( 'grunt-babel' );

	// Default task(s).
	grunt.registerTask( 'bumpVersionDo', '', function bumpVersionDo() {
		let version;
		if ( 'custom' === grunt.config( 'bump.increment' )) {
			version = grunt.config( 'bump.version' );
			grunt.log.ok( 'Bumping version to ' + version.yellow + ':' );
		} else {
			version = semver.inc( currentVersion, grunt.config( 'bump.increment' ));
			grunt.log.ok( 'Bumping up ' + grunt.config( 'bump.increment' ).yellow + ' version number.' );
		}


		if ( _( grunt.config( 'bump.files' )).includes( 'package' )) {
			grunt.log.ok( 'Updating ' + 'package.json'.yellow + '.' );
			try {
				let thisPackage = require( './package.json' );
				if ( typeof thisPackage.version != 'string' )					{
					throw new TypeError( '"package.json" should include a version number.' );
				}
				thisPackage.version = version;
				fs.writeFileSync( './package.json', JSON.stringify( thisPackage, null, 2 ));
				grunt.log.ok( 'Updated "' + 'package.json'.green + '".' );
			} catch ( e ) {
				grunt.log.error( 'Update of "' + 'package.json'.red + '" failed: ' + e.toString());
			}
		}

		if ( _( grunt.config( 'bump.files' )).includes( 'bower' )) {
			if ( !grunt.file.isFile( 'bower.json' )) {
				grunt.log.ok( 'Creating ' + 'bower.json'.yellow + '.' );
			}
			grunt.log.ok( 'Updating ' + 'bower.json'.yellow + '.' );
		}

		if ( _( grunt.config( 'bump.files' )).includes( 'git' )) {
			grunt.log.ok( 'Updating ' + 'git tag'.yellow + '.' );
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
			//'eslint:strict_nodejs',
			'lesslint:strict',
			'bumpVersion',
			'changed:replace:headers',
			'replace:readmeVersion',
			'refreshResources',
			'wp_readme_to_markdown',
			'rsync:svn',
			/* Add unit tests here */
		]
	);
	grunt.registerTask(
		'documentate',
		[
			'jsdoc',
			'docco',
			'phpdoc',
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
			'babel:dist',
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
