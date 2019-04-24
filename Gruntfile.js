// tslint:disable: no-implicit-dependencies
const { join } = require( 'path' );
require( 'dotenv' ).config();

module.exports = grunt => {
	require( 'load-grunt-config' )( grunt, {
		// path to task.js files, defaults to grunt dir
		configPath: join( process.cwd(), 'build/grunt/configs' ),
		// ...
		jitGrunt: {
			customTasksDir: './build/grunt/tasks',
			// here you can pass options to jit-grunt (or just jitGrunt: true)
			staticMappings: {
				// here you can specify static mappings, for example:
			},
		},
	} );

	// Default task(s).
	grunt.registerTask( 'default', [ 'watch:assets' ] );
	grunt.registerTask( 'versionUpgrade', 'Do the process to change version number', [
		'bump-version-precheck',
		'lint',
		'test',
		'prompt:upgrade',
		'rebuildAssets',
		'bump-version-do',
		'changed:replace:headers',
		'replace:readmeVersion',
		'wp_readme_to_markdown',
	] );
	grunt.registerTask( 'documentate', [
		'phpdoc',
	] );
	grunt.registerTask( 'rebuildAssets', [
		'sh:rollup-build',
		'htmlmin',
	] );

	grunt.registerTask( 'lint:fix', [
		'tslint:fix',
		'phpcbf',
	] );
	grunt.registerTask( 'lint', [
		'tslint:nofix',
		'phplint',
	] );

	grunt.registerTask( 'test', [
		'phpunit',
	] );
};
