// tslint:disable: no-implicit-dependencies
const { inc } = require( 'semver' );

module.exports = grunt => {
	grunt.registerTask( 'bump-version-do', '', () => {
		grunt.task.requires( 'prompt.upgrade' );

		let version;
		if ( 'custom' === grunt.config( 'bump.increment' ) ) {
			version = grunt.config( 'bump.version' );
			grunt.log.ok( `Bumping version to ${ version.yellow }:` );
		} else {
			version = inc( grunt.version, grunt.config( 'bump.increment' ) );
			grunt.log.ok( `Bumping up ${ grunt.config( 'bump.increment' ).yellow } version number.` );
		}
		if ( null === version ) {
			grunt.log.warn( `Could not determine the ${ 'new version'.red }, reusing previous ${ grunt.version }.` );
			version = grunt.version;
		}

		if ( _( grunt.config( 'bump.files' ) ).includes( 'package' ) ) {
			grunt.log.ok( `Updating ${ 'package.json'.yellow }.` );
			try {
				let thisPackage = require( pkgPath );
				if ( typeof thisPackage.version !== 'string' )					{
					throw new TypeError( '"package.json" should include a version number.' );
				}
				thisPackage.version = version;
				fs.writeFileSync( pkgPath, JSON.stringify( thisPackage, null, 2 ) );
				grunt.log.ok( `Updated "${ 'package.json'.green }".` );
			} catch ( e ) {
				grunt.log.error( `Update of "${ 'package.json'.red }" failed: ${ e.toString() }` );
			}
		}

		if ( _( grunt.config( 'bump.files' ) ).includes( 'bower' ) ) {
			if ( !grunt.file.isFile( 'bower.json' ) ) {
				grunt.log.ok( `Creating ${ 'bower.json'.yellow }.` );
			}
			grunt.log.ok( `Updating ${ 'bower.json'.yellow }.` );
		}

		if ( _( grunt.config( 'bump.files' ) ).includes( 'git' ) ) {
			grunt.log.ok( `Updating ${ 'git tag'.yellow }.` );
		}
	} );
};
