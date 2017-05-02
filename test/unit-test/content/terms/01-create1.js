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
}).thenOpen( config.test_site.site_url + '/wp-admin/post-new.php?post_type=glossary', function createNewPost() {
	this.fill( '#post', {
		post_title: 'Contractual Delivery Date',
		content:    `<p><b>Contractual Delivery Date</b> (often mentioned as CDD) is a term used by <a href="/wiki/Openreach" title="Openreach">Openreach</a>, the infrastructure division of the <a href="/wiki/BT_Group" title="BT Group">BT Group</a> in the United Kingdom. It represents the date when the requested service will be delivered to the client in a fully functional state.</p>
<h2><span class="mw-headline" id="Background_Information">Background Information</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Contractual_Delivery_Date&amp;action=edit&amp;section=1" title="Edit section: Background Information">edit</a><span class="mw-editsection-bracket">]</span></span></h2>
<p>When a customer requests the provisioning of a new service from BT, for example a network circuit based on <a href="/wiki/Metro_Ethernet" title="Metro Ethernet">Metro Ethernet</a> technology or any Premium Service, Openreach will conduct a survey and then supply a KCI (Keeping Customers Informed) update with the estimated Contractual Delivery Date.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1">[1]</a></sup> This date is an estimate only; it can be amended as the order progresses after agreeing with the client.<sup id="cite_ref-2" class="reference"><a href="#cite_note-2">[2]</a></sup> However, since the CDD is provided after the site surveys which identify potential difficulties, it is a reasonable estimate of the final delivery schedule for the ordered service.</p>`,
	});
}).thenClick( '#publish', function submitNewPost() {
	var url = this.getCurrentUrl(),
		idMatch = url.match( /post=(\d+)/ );
	if ( !idMatch ) {
		return this.triggerError( 1, 'Unable to retrieve new term id' );
	}
}).thenOpen( config.test_site.site_url + '/wp-admin/edit.php?post_type=glossary' ).then( function recountPosts() {
	var count = this.evaluate( function countPostsEvaluate( postSelector ) {
		return __utils__.findAll( postSelector ).length;
	}, postSelector );
	if ( count !== postsCount + 1 ) {
		return this.triggerError( 1, 'No post created' );
	}
});

casper.run();
