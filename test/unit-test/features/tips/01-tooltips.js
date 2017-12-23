var fs = require( 'fs' );
var currentFile = require( 'system' ).args[3];
var curFilePath = fs.absolute( currentFile ).split( '/' );
while ( curFilePath[curFilePath.length - 1] !== 'test' ) {
	curFilePath.pop();
}
fs.changeWorkingDirectory( curFilePath.join( '/' ));

var casper = require( './initCasper.js' );
var config = casper.config;

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).thenOpen( config.test_site.site_url + '/wp-admin/post-new.php', function createNewPost() {
	this.fill( '#post', {
		post_title: 'Tooltip test',
		content:    '<p>You can see here a [itg-tooltip tooltip-content="&lt;p&gt;This is a &lt;em&gt;sample tooltip&lt;/em&gt;&lt;/p&gt;" href="/"]tooltip[/itg-tooltip] containing a sample text</p>',
	});
}).thenClick( '#publish', function submitNewPost() {
	var url = this.getCurrentUrl(),
		idMatch = url.match( /post=(\d+)/ );
	if ( !idMatch ) {
		return this.triggerError( 2, 'Unable to retrieve new post id' );
	}
	this.thenOpen( config.test_site.site_url + '/?p=' + idMatch[1], function onArticlePage() {
		if ( !this.exists( '.itg-tooltip a' )) {
			return this.triggerError( 2, 'Can\'t find dom element' );
		}
		var trigger = this.evaluate( function getTooltipTrigger() {
			return iThoughtsTooltipGlossary.tipTrigger;
		});
		if ( 'click' === trigger ) {
			this.click( '.itg-tooltip a' );
		} else {
			this.mouse.move( '.itg-tooltip a' );
		}
	}).waitForSelector( '.qtip.itg-tooltip', function foundTip() {
		if ( !this.visible( '.qtip.itg-tooltip' )) {
			return this.triggerError( 1, 'Tooltip is not recognized as visible' );
		}
		var tooltipInfos = this.getElementInfo( '.qtip.itg-tooltip' );
		if (
			'div' !== tooltipInfos.nodeName ||
			!tooltipInfos.attributes.id.match( /^qtip-\d+$/ ) ||
			'false' !== tooltipInfos.attributes['aria-hidden'] ||
			this.lodash( 'qtip itg-tooltip qtip-focus'.split( ' ' )).difference( tooltipInfos.attributes.class.split( ' ' )).value().length !== 0
		) {
			return this.triggerError( 1, 'Tooltip isn\'t properly configured' );
		}
		if ( this.getElementInfo( '.qtip.itg-tooltip .qtip-titlebar' ).text !== 'tooltip' ) {
			return this.triggerError( 1, 'Wrong title in title bar' );
		}
		if ( this.getElementInfo( '.qtip.itg-tooltip .qtip-content' ).text !== 'This is a sample tooltip' ) {
			return this.triggerError( 1, 'Wrong content in tip' );
		}
	});
});

casper.run();
