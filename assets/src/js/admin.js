/**
 * @file Old file. To merge
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

'use strict';

const initFloater = require( './floater' );
const comon = require( './comon' );

const ithoughts = ithoughtsCore;

const {
	$, $d,
} = ithoughts;
const itg = iThoughtsTooltipGlossary;

/**
 * Set the style of the target, appending to a default classes array the *themename*
 *
 * @param  {boolean|string[]} keepDefaults - Set to `true` to use *default styles*. If an array is given, those classes are used as *default*.
 * @param  {string}           themename    - Class name of the theme
 * @param  {jQuery}           target       - QTip holder to edit
 * @returns {undefined} This function does not have any return value.
 */
itg.updateStyle = ( keepDefaults, themename, target ) => {
	let styles = [ `qtip-${ themename }` ];
	if ( true === keepDefaults ) {
		// iF we have simply `true`, add default styles
		styles = styles.concat([
			'ithoughts_tt_gl-tooltip',
			'qtip-pos-br',
		]);
	} else if ( typeof keepDefaults !== 'undefined' && keepDefaults && 'Array' === keepDefaults.constructor.name ) {
		// If having an array, use it as default styles
		styles = styles.concat( keepDefaults );
	}

	target.qtip( 'option', 'style.classes', styles.join( ' ' ));
};

$d
	.ready( initFloater )
	.ready(() => {
	// #### Get some DOMs
	// Get the tip and show it
		const $demotip = $( '#qtip-exampleStyle' );
		$demotip.qtip( 'api' ).show();

		const events = 'change blur keyup mouseup';
	
		// Styles
		const $styleI = $( '#tip-style' );
		const $shadowI = $( '#tip-shadow' );
		const $roundedI = $( '#tip-rounded' );
		ithoughts.$merge( $styleI, $shadowI, $roundedI ).bind( events, () => {
			const baseStyles = [
				'ithoughts_tt_gl-tooltip',
				'qtip-pos-br',
			];
			if ( $shadowI.is( ':checked' )) {
				baseStyles.push( 'qtip-shadow' );
			}
			if ( $roundedI.is( ':checked' )) {
				baseStyles.push( 'qtip-rounded' );
			}
			itg.updateStyle( baseStyles, $styleI.val(), $demotip );
		});
	
		// Events & effects
		const $triggerI = $( '#tip-trigger' );
		const $animInI = $( '#tip-anim-in' );
		const $animOutI = $( '#tip-anim-out' );
		const $animTimeI = $( '#tip-anim-time' );
		ithoughts.$merge( $triggerI, $animInI, $animOutI, $animTimeI ).bind( events, () => {
		// Set the demotip as configured in the inputs
			const trigger = $triggerI.val();
			try {
				$demotip
					.qtip( 'option', 'show.event', trigger )
					.qtip( 'option', 'hide.event', ( 'responsive' === trigger ) ? 'responsiveout' : 'mouseleave' )
					.qtip( 'option', 'show.effect', itg.animationFunctions.in[$animInI.val()])
					.qtip( 'option', 'hide.effect', itg.animationFunctions.out[$animOutI.val()])
					.prop( 'animation_duration', parseInt( $animTimeI.val() || 500 ));
			} catch ( error ) {
				itg.error( error );
			}
		});
	
		// Log purge
		$( '#itg-purge' ).click( async() => {
			try {
				await comon.sendAjaxQuery( 'purge_logs', null, $( '#_wpnonce' ).val());
			} catch ( error ) {
				itg.growl( 'AJAX request error', error.statusText, false );
			}
		});
	
		// Verbosity
		const $verbosityInput = $( '#verbosity' );
		const $verbosityLabel = $( '#ithoughts_tt_gl-verbosity_label' );
		const verbosityLabels = $verbosityLabel.data( 'labels' );
		$verbosityInput.on( 'input', () => {
			$verbosityLabel.text( verbosityLabels[$verbosityInput.val()]);
		}).trigger( 'input' );
	
		// Page index
		const $glossaryIndex = $( '#glossary-index' );
		$glossaryIndex.bind( events.replace( 'blur', '' ).replace( 'mouseup', '' ), () => {
			if ( 'new' === $glossaryIndex.val() && itg.indexPageEditor ) {
				$glossaryIndex.focusout();
				itg.indexPageEditor();
			}
		});
	});
