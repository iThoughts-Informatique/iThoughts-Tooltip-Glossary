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
var beforeValues;
var afterValues;

function pickPossibleOptions( selector ) {
	var options = casper.getElementsAttribute( selector + ' option', 'value' );
	return options;
}

function pickDifferentOption( possible, current ) {
	var possibleValues = casper.lodash.difference( possible, [ current ]);
	return possibleValues[Math.floor( Math.random() * possibleValues.length )];
}

casper.start( config.test_site.site_url + '/wp-admin', function start() {
	this.fill( '#loginform', {
		log: config.test_site.login,
		pwd: config.test_site.password,
	}, true );
}).thenOpen( 'http://wordpress.loc/wp-admin/admin.php?page=ithoughts-tooltip-glossary', function onOptionsPage() {
	beforeValues = casper.evaluate( function getOptions() {
		return __utils__.getFormValues( 'form.simpleajaxform' );
	});
}).then( function changeOptions() {
	afterValues = {
		tipTrigger: pickDifferentOption( pickPossibleOptions( '#tip-trigger' ), beforeValues.tipTrigger ),
		tipStyle:   pickDifferentOption( pickPossibleOptions( '#tip-style' ), beforeValues.tipStyle ),
		tipShadow:  !beforeValues.tipShadow,
		tipRounded: !beforeValues.tipRounded,
		tipAnimIn:     pickDifferentOption( pickPossibleOptions( '#tip-anim-in' ), beforeValues.tipAnimIn ),
		tipAnimOut:    pickDifferentOption( pickPossibleOptions( '#tip-anim-out' ), beforeValues.tipAnimOut ),
		tipAnimTime:   pickDifferentOption([ '1000', '750', '666', '500', '250' ], beforeValues.tipAnimTime ),
	};
	this.fill( 'form.simpleajaxform', afterValues, true );
}).waitForSelector( '.clear.notice', function updateDone() {
	if ( this.exists( '.clear.notice.notice-error' )) {
		return this.triggerError( 2, 'Error during update' );
	}
}).reload().then( function onOptionsPageReloaded() {
	var newValues = casper.evaluate( function getNewOptions() {
		return __utils__.getFormValues( 'form.simpleajaxform' );
	});
	for ( var i in afterValues ) {
		if ( afterValues[i] !== newValues[i] && ( afterValues[i] !== false || newValues[i] !== undefined ))			{
			return this.triggerError( 1, 'A form field wasn\'t persisted: "' + i + '",  from "' + afterValues[i] + '" to "' + newValues[i] +'".' ); 
		}
	}
}).run();
