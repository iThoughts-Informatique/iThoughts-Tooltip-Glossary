const { yellow, blue, underline, grey } = require( 'chalk' );
const { inc } = require( 'semver' );

module.exports = grunt => ({
	upgrade: {
		options: {
			questions: [{
				config:  'bump.increment',
				type:    'list',
				message: 'Bump version from ' + '<%= pkg.version %>'.cyan + ' to:',
				choices: [
					{ value: 'build', name:  `${yellow( `Build:  ${grunt.version}-?` )} > Unstable, betas, and release candidates.` },
					{ value: 'patch', name:  `${yellow( `Patch:  ${inc( grunt.version, 'patch' )}` )}   > Backwards-compatible bug fixes.` },
					{ value: 'minor', name:  `${yellow( `Minor:  ${inc( grunt.version, 'minor' )}` )}   > Add functionality in a backwards-compatible manner.` },
					{ value: 'major', name:  `${yellow( `Major:  ${inc( grunt.version, 'major' )}` )}   > Incompatible API changes.` },
					{ value: 'custom', name:  `${yellow( 'Custom: ?.?.?' )}   > Specify version...` },
				],
			}, {
				config:  'bump.version',
				type:    'input',
				message: 'What specific version would you like',
				when:    answers => 'custom' === answers['bump.increment'],
				validate: value => valid( value ) || `Must be a valid semver, such as 1.2.3-rc1. See ${blue(underline( 'http://semver.org/' ))} for more details.`,
			}, {
				config:  'bump.files',
				type:    'checkbox',
				message: 'What should get the new version:',
				choices: [
					{ value:   'package', name:    'package.json' + ( !grunt.file.isFile( 'package.json' ) ? grey( ' file not found, will create one' ) : '' ), checked: grunt.file.isFile( 'package.json' ), },
					{ value:   'bower',   name:    'bower.json' + ( !grunt.file.isFile( 'bower.json' ) ? grey( ' file not found, will create one' ) : '' ), checked: grunt.file.isFile( 'bower.json' ), },
					{ value:   'git',     name:    'git tag', checked: grunt.file.isDir( '.git' ), },
				],
			}, /*{
				config:   'bump.changelogs',
				type:     'editor',
				message:  `What are the changes from v<%= pkg.version %> to put in "${chalk.green.bold('Changelogs')}" section ? `,
				validate: value => ( value.length > 10 || chalk.bold(`The changelog section must be an ${chalk.underline('unordered list')} of changed items. Please be more verbose` ) ),
			},
			{
				config:  'bump.upgradeNotice',
				type:    'editor',
				message: `What are the changes from v<%= pkg.version %> to put in "${chalk.green.bold('Upgrade Notice')}" section ? (optionnal)`,
			}*/ ],
		},
	},
})
