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
	var $ = ithoughts.$;

	ithoughts.$d.ready( function onDocumentReady() {
		var ajaxCallback = function ajaxCallback( res ) {
			if ( res.valid ) {
				var styleTag = $( '#ithoughts_tt_gl-custom_theme' );
				if ( 0 === styleTag.length ) {
					styleTag = $( $.parseHTML( '<style id="ithoughts_tt_gl-custom_theme"></style>' ));
					$( 'body' ).append( styleTag );
				}
				styleTag[0].innerHTML = res.css;

				window.updateStyle( null, res.theme_name );
			} else {
				iThoughtsTooltipGlossary.error( 'Error while getting preview style', res );
			}
		};
		$( '#LESS-form' )[0].simpleAjaxCallback = ajaxCallback;
		var theme = $( '[name="themename"]' ).val();
		if ( theme !== '' && theme ) {
			window.updateStyle( null, theme );
		}
		$( '[name="themename"]' ).change( function onThemeChange() {
			$( this ).parent().find( 'button' ).prop( 'disabled', !this.value );
		}).change();
	});
})( iThoughts.v5 );
