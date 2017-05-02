/* global __utils__: false */

var fs = require( 'fs' );
var currentFile = require( 'system' ).args[3];
var curFilePath = fs.absolute( currentFile ).split( '/' );
while ( curFilePath[curFilePath.length - 1] !== 'test' ) {
	curFilePath.pop();
}
fs.changeWorkingDirectory( curFilePath.join( '/' ));

var casper = require( './initCasper.js' );
var config = casper.config;

var postSelector = 'table.wp-list-table.posts tr.type-glossary';
var postsCount;

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).thenOpen( config.test_site.site_url + '/wp-admin/edit.php?post_type=glossary' ).then( function countPosts() {
	postsCount = this.evaluate( function countPostsEvaluate( postSelector ) {
		return __utils__.findAll( postSelector ).length;
	}, postSelector );
}).thenClick( '.submitdelete' ).then( function recountPosts() {
	var count = this.evaluate( function countPostsEvaluate( postSelector ) {
		return __utils__.findAll( postSelector ).length;
	}, postSelector );
	if ( count !== postsCount - 1 ) {
		return this.triggerError( 1, 'No post deleted' );
	}
});

casper.run();
