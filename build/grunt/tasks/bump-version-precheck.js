module.exports = grunt => {
	grunt.registerTask( 'bump-version-precheck', '', () => {
		for ( const envVar of ['WP_PATH'] ) {
			if ( !process.env[envVar] ) {
				grunt.fail.fatal( `Missing required environment var "${envVar}"`, 1 );
			}
		}
		grunt.log.ok( 'All vars checked, go apply new version.' );
	} );
};
