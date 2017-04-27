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
var url;
var selectorPlugins = '#menu-plugins > a';

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).waitForSelector( selectorPlugins, function waitDone() {
	console.log("Yolo");
	console.log(this.mouse);
	casper.click( selectorPlugins );
	console.log("Clicked")
}, function waitTimeout() {
	return this.triggerError( 3, 'Could not get the plugins page' );
}).wait(5000).then( function enablePlugin() {
	if ( !this.exists( 'table.plugins tr[data-slug="ithoughts-tooltip-glossary"]' )) {
		return this.triggerError( 3, 'The plugin was not found in the list of items. Maybe it is not well installed' );
	}
	if ( this.exists( 'table.plugins tr[data-slug="ithoughts-tooltip-glossary"].inactive' )) {
		this.thenClick( 'tr[data-slug="ithoughts-tooltip-glossary"] .activate a', function clickEnable() {
			if ( this.exists( '#message.error' )) {
				return this.triggerError( 1, 'There was an error activating the plugin' );
			}
		});
	}
	doToggle.call( this );
});

function doToggle() {
	if ( !this.exists( 'table.plugins tr[data-slug="ithoughts-tooltip-glossary"].active' )) {
		return this.triggerError( 1, 'Can\'t find the plugin activated item' );
	}
	this.thenClick( 'tr[data-slug="ithoughts-tooltip-glossary"] .deactivate a', function doDeactivatePlugin() {
		if ( this.exists( '#message.error' )) {
			return this.triggerError( 1, 'An error occured when deactivating the plugin' );
		}
		if ( !this.exists( 'table.plugins tr[data-slug="ithoughts-tooltip-glossary"].inactive' )) {
			return this.triggerError( 1, 'Can\'t find the plugin deactivated item' );
		}
	}).thenClick( 'tr[data-slug="ithoughts-tooltip-glossary"] .activate a', function doReactivatePlugin() {
		if ( this.exists( '#message.error' )) {
			return this.triggerError( 1, 'An error occured when activating the plugin' );
		}
	});
}

casper.run();
