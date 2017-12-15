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
		scssFiles = [{
			expand: true,
			cwd:    'assets/src/scss',
			src:    [ '*.scss' ],
			dest:   'assets/dist/css/',
			ext: '.min.css',
		}],
		jsPaths = [
			'assets/src/js/**/*.js',
			'tests/**/*.js',
		],
		phpFiles = {
			src: [
				'class/**/*.php',
				'templates/src/**/*.php',
				'*.php',
			],
		},
		gruntLocalconfig = require( './grunt_localconfig.json' );

	const gruntConfig = {
		pkg:    grunt.file.readJSON( 'package.json' ),
		browserify: {
			dist: {
				options:{
					browserifyOptions: {
						standalone: false,
					},
				},
				files: {
					'assets/build/js/admin.js': 'assets/src/js/admin.js',
					'assets/build/js/atoz.js': 'assets/src/js/atoz.js',
					'assets/build/js/main.js': 'assets/src/js/main.js',
					'assets/build/js/pageEditor.js': 'assets/src/js/pageEditor.js',
					'assets/build/js/style-editor.js': 'assets/src/js/style-editor.js',
					'assets/build/js/updater.js': 'assets/src/js/updater.js',
					'assets/build/js/tinymce/form-handler.js': 'assets/src/js/tinymce/form-handler.js',
					'assets/build/js/tinymce/tinymce.js': 'assets/src/js/tinymce/tinymce-plugin.js',
				},
			},
		},
		babel: {
			options: {
				sourceMap: true,
				presets:   [
					[ 'env', {
						//modules: 'umd',
						//modules: 'systemjs',
						targets: {
							browsers: [ 
								'>1%',
								'last 4 versions',
								'Firefox ESR',
								'not ie < 9',
							],
						},
						//						uglify:      false,
						loose:       false,
						debug:       false,
						useBuiltIns: 'usage',
					}],
				],
			},
			dist: {
				files: [{
					expand: true,
					cwd : 'assets/build',
					src: '**/*.js',
					dest: 'assets/dist',
					ext:  '.js',
				}],
			},
		},
		uglify: {
			options: {
				preserveComments: 'some',
				banner:    '/*! <%= pkg.name %> build on <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> for v<%= pkg.version %> */',
				sourceMap: true,
				footer:    '/**/',
			},
			dist: {
				files: [
					{
						expand: true,
						src:    [
							'assets/dist/js/**/*.js',
							'!**/*.min.js',
						],
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
				src:     jsPaths,
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
					'assets/src/js/**/*.js',
					'assets/src/scss/**/*.scss',
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
							const wpVersionFile = require( 'path' ).resolve(
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
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 7,
				},
				files: [{
					expand: true,
					cwd: 'assets/src/imgs',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'assets/dist/imgs',
				}],
			},
		},
		sass: {
			options: {
				style: 'compressed',
			},
			dist: {
				files:   scssFiles,
			},
		},
		eslint: {
			options: {
				format:      'stylish',
				fix:         true,
				useEslintrc: false,
				configFile:  'lint/eslint.json',
				quiet:       true,
				maxWarnings: -1,
				fix:         true,
				silent:      true,
			},
			dist: {
				src: jsPaths,
			},
			node: {
				src: [
					'Gruntfile.js',
					'test/**/*.js',
					'!test/node_modules/**/*.js',
				],
			},
		},
		docco: {
			debug: {
				src:     jsPaths,
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
									name:  `${chalk.yellow( `Build:  ${currentVersion}-?` )} > Unstable, betas, and release candidates.`,
								},
								{
									value: 'patch',
									name:  `${chalk.yellow( `Patch:  ${semver.inc( currentVersion, 'patch' )}` )}   > Backwards-compatible bug fixes.`,
								},
								{
									value: 'minor',
									name:  `${chalk.yellow( `Minor:  ${semver.inc( currentVersion, 'minor' )}` )}   > Add functionality in a backwards-compatible manner.`,
								},
								{
									value: 'major',
									name:  `${chalk.yellow( `Major:  ${semver.inc( currentVersion, 'major' )}` )}   > Incompatible API changes.`,
								},
								{
									value: 'custom',
									name:  `${chalk.yellow( 'Custom: ?.?.?' )}   > Specify version...`,
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
								return valid || `Must be a valid semver, such as 1.2.3-rc1. See ${chalk.blue.underline( 'http://semver.org/' )} for more details.`;
							},
						},
						{
							config:  'bump.files',
							type:    'checkbox',
							message: 'What should get the new version:',
							choices: [
								{
									value:   'package',
									name:    'package.json' + ( !grunt.file.isFile( 'package.json' ) ? chalk.grey( ' file not found, will create one' ) : '' ),
									checked: grunt.file.isFile( 'package.json' ),
								},
								{
									value:   'bower',
									name:    'bower.json' + ( !grunt.file.isFile( 'bower.json' ) ? chalk.grey( ' file not found, will create one' ) : '' ),
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
					verbose: true,
					//					template: 'abstract',
				},
				src: [
					'class/**/*.php',
					'*.php',
				],
				dest: 'docs/php',
			},
		},
		wp_readme_to_markdown: {
			dist: {
				files: {
					'readme.md': 'readme.txt',
				},
			},
		},
		phpcbf: {
			options: {
				standard: 'lint/phpcs.xml',
			},
			files: phpFiles,
		},
		phpcs: {
			options: {
				standard: 'lint/phpcs.xml',
			},
			files: phpFiles,
		},
	};
	if ( typeof gruntLocalconfig !== 'undefined' && typeof gruntLocalconfig.svn_path !== 'undefined' ) {
		gruntConfig.rsync = {
			svn: {
				options: {
					src:       '.',
					dest:      require( 'path' ).resolve( gruntLocalconfig.svn_path, 'trunk' ),
					deleteAll: true,
					exclude:   [
						'.*',
						'node_modules',
						'test',
						'templates/src',
						'assets/src',
						'assets/build',
						'lint',
						'*.log',
						'docs',
						'Gruntfile.js',
						'grunt_localconfig.json',
						'package-lock.json',
					],
					recursive: true,
				},
			},
		};
	}
	grunt.initConfig( gruntConfig );

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-changed' );
	grunt.loadNpmTasks( 'grunt-jsdoc' );
	grunt.loadNpmTasks( 'grunt-docco' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-prompt' );
	grunt.loadNpmTasks( 'grunt-phpdoc' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'grunt-rsync' );
	grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-phpcbf' );
	grunt.loadNpmTasks( 'grunt-phpcs' );
	grunt.loadNpmTasks('grunt-contrib-imagemin');

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
		if ( null == version ) {
			version = currentVersion;
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

	grunt.registerTask( 'bumpVersion', [
		'prompt:upgrade',
		'bumpVersionDo',
	]);
	grunt.registerTask( 'versionUpgrade', 'Do the process to change version number', [
		'phpcbf',
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
	]);
	grunt.registerTask( 'documentate', [
		'jsdoc',
		'docco',
		'phpdoc',
	]);
	grunt.registerTask( 'buildStyles', [
		'sass',
	]);
	grunt.registerTask( 'buildScripts', [
		//'eslint:dist',
		'browserify:dist',
		'babel:dist',
		'uglify:dist',
	]);
	grunt.registerTask( 'build', [
		'buildScripts',
		'buildStyles',
		'changed:imagemin',
		'changed:htmlmin',
	]);
	grunt.registerTask( 'lint', [
		'eslint:node',
		'eslint:dist',
		'phpcs',
	]);
};
