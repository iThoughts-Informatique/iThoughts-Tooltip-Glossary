var fs = require( 'fs' );
var currentFile = require( 'system' ).args[3];
var curFilePath = fs.absolute( currentFile ).split( '/' );
while ( curFilePath[curFilePath.length - 1] !== 'test' ) {
	curFilePath.pop();
}
fs.changeWorkingDirectory( curFilePath.join( '/' ));

var casper = require( './initCasper.js' );
var config = casper.config;

function doTrigger(selector, trigger) {
	if ( 'click' === trigger ) {
		casper.click( selector );
	} else {
		casper.mouse.move( selector );
	}
}
var target;

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).thenOpen( config.test_site.site_url + '/wp-admin/post-new.php', function createNewPost() {
	this.fill( '#post', {
		post_title: 'Tooltip test',
		content:    '<p>This is a [itg-mediatip href="https://www.w3schools.com/css/css3_images.asp" mediatip-type="webimage" mediatip-content="https://www.w3schools.com/css/img_lights.jpg" mediatip-caption="This is the caption"]mediatip[/itg-mediatip] containing a W3School Image</p>\n\
<p>Then a [itg-mediatip mediatip-type="webvideo" mediatip-content="&lt;iframe width=&amp;aquot;512&amp;aquot; height=&amp;aquot;288&amp;aquot; src=&amp;aquot;https://www.youtube.com/embed/9yRK6JWl268&amp;aquot; frameborder=&amp;aquot;0&amp;aquot; allowfullscreen&gt;&lt;/iframe&gt;"]video[/itg-mediatip]</p>',
	});
}).thenClick( '#publish', function submitNewPost() {
	var url = this.getCurrentUrl(),
		idMatch = url.match( /post=(\d+)/ );
	if ( !idMatch ) {
		return this.triggerError( 2, 'Unable to retrieve new post id' );
	}
	this.thenOpen( config.test_site.site_url + '/?p=' + idMatch[1], function onArticlePage() {
		if ( !this.exists( '.itg-mediatip[data-hasqtip="0"] a' ) || !this.exists( '.itg-mediatip[data-hasqtip="1"] a' )) {
			return this.triggerError( 2, 'Can\'t find dom elements' );
		}
		var trigger = this.evaluate( function getTooltipTrigger() {
			return iThoughtsTooltipGlossary.qtiptrigger;
		});
		doTrigger( '.itg-mediatip[data-hasqtip="0"] a', trigger );
	});
	target = '.qtip.itg-mediatip#qtip-0';
	this.waitForSelector( target, (function(){
		var t = target;
		return function foundTip() {
			if ( !this.visible( t )) {
				return this.triggerError( 1, 'Tooltip is not recognized as visible' );
			}
			var tooltipInfos = this.getElementInfo( t );
			if (
				'div' !== tooltipInfos.nodeName ||
				'false' !== tooltipInfos.attributes['aria-hidden'] ||
				this.lodash( 'qtip itg-mediatip qtip-focus'.split( ' ' )).difference( tooltipInfos.attributes.class.split( ' ' )).value().length !== 0
			) {
				return this.triggerError( 1, 'Tooltip isn\'t properly configured' );
			}
			if ( this.getElementInfo( t + ' .qtip-titlebar' ).text !== 'mediatip' ) {
				console.log('"'+this.getElementInfo( t + ' .qtip-titlebar' ).text+'"');
				return this.triggerError( 1, 'Wrong title in title bar' );
			}
			if ( this.getElementInfo( t + ' .qtip-content' ).text !== 'This is the caption' ) {
				return this.triggerError( 1, 'Wrong content in tip' );
			}
			doTrigger( '.itg-mediatip[data-hasqtip="0"] a', trigger );
			target = '.qtip.itg-mediatip#qtip-1';
		};
	})());
	target = '.qtip.itg-mediatip#qtip-0';
	this.waitForSelector( target, (function(){
		var t = target;
		return function foundTip() {
			if ( !this.visible( t )) {
				return this.triggerError( 1, 'Tooltip is not recognized as visible' );
			}
			var tooltipInfos = this.getElementInfo( t );
			if (
				'div' !== tooltipInfos.nodeName ||
				'false' !== tooltipInfos.attributes['aria-hidden'] ||
				this.lodash( 'qtip itg-mediatip qtip-focus'.split( ' ' )).difference( tooltipInfos.attributes.class.split( ' ' )).value().length !== 0
			) {
				return this.triggerError( 1, 'Tooltip isn\'t properly configured' );
			}
			if ( this.getElementInfo( t + ' .qtip-titlebar' ).text !== 'video' ) {
				return this.triggerError( 1, 'Wrong title in title bar' );
			}
			if ( this.getElementInfo( t + ' .qtip-content' ).text !== '' ) {
				return this.triggerError( 1, 'Wrong content in tip' );
			}
		};
	})());
});

casper.run();
