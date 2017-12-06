(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file Client-side style-editor logic
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

'use strict';

( function selfCalling( ithoughts ) {
	var $ = ithoughts.$,
		itg = iThoughtsTooltipGlossary,
		$themeName,
		$themeSelect;

	ithoughts.$d.ready( function onDocumentReady() {
		$themeSelect = $( '[name="theme_select"]' );
		$themeName = $( '[name="theme_name"]' );
		$( '[data-tooltip-id="exampleStyle"]' ).qtip( 'api' ).show();
		var ajaxCallback = function ajaxCallback( res ) {
			if ( res.valid ) {
				if ( res.hasOwnProperty( 'css' ) && res.hasOwnProperty( 'theme_name' )) {
					// This is a preview
					try {
						itg.log( 'Received CSS response from server:', res );
						var styleTag = $( '#ithoughts_tt_gl-custom_theme' );
						if ( 0 === styleTag.length ) {
							styleTag = $( $.parseHTML( '<style id="ithoughts_tt_gl-custom_theme"></style>' ));
							$( 'body' ).append( styleTag );
						}
						styleTag[0].innerHTML = res.css;

						itg.updateStyle( true, res.theme_name, $( '#qtip-exampleStyle' ));
					} catch ( e ) {
						itg.error( 'Error during setting preview style:', e );
					}
				} else {
					// This is a save
					var name = $themeName.val();
					if ( 0 === $themeSelect.find( `option[value="${ name }"]` ).length ) {
						$themeSelect.append( `<option value="${ name }">${ name }</option>` );
						$themeSelect.val( name ).change();
					}
				}
			} else {
				itg.error( 'Error while getting preview style', res );
			}
		};
		$( '#LESS-form' )[0].simple_ajax_callback = ajaxCallback;
		$themeSelect.change( function onThemeChange() {
			$( this ).parent().find( 'button' ).prop( 'disabled', !this.value );
		}).change();
	});
})( iThoughts.v5 );

},{}]},{},[1]);
