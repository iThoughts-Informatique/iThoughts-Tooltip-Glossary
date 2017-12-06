(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

( function selfCalling( ithoughts ) {
	var $ = ithoughts.$,
		itg = iThoughtsTooltipGlossary;

	itg.updateStyle = ( keepDefaults, themename, target ) => {
		var styles = [ `qtip-${ themename }` ];
		if ( true === keepDefaults ) {
			styles = [
				'ithoughts_tt_gl-tooltip',
				'qtip-pos-br',
			].concat( styles );
		} else if ( typeof keepDefaults !== 'undefined' && keepDefaults && 'Array' === keepDefaults.constructor.name ) {
			styles = keepDefaults.concat( styles );
		}

		target.qtip( 'option', 'style.classes', styles.join( ' ' ));
	};

	ithoughts.$d.ready( function onDocumentReady() {
		$( '[data-tooltip-id="exampleStyle"]' ).qtip( 'api' ).show();
		var events = 'change blur keyup mouseup',
			updateActivationPreview = ( function updateActivationPreviewWrapper() {
				var triggerI = $( '#qtiptrigger' ),
					animInI = $( '#anim_in' ),
					animOutI = $( '#anim_out' ),
					animTimeI = $( '#anim_time' );
				return function updateActivationPreview() {
					var trigger = triggerI.val();
					try {
						$demotip
							.qtip( 'option', 'show.event', trigger )
							.qtip( 'option', 'hide.event', ( 'responsive' === trigger ) ? 'responsiveout' : 'mouseleave' )
							.qtip( 'option', 'show.effect', itg.animationFunctions.in[animInI.val()])
							.qtip( 'option', 'hide.effect', itg.animationFunctions.out[animOutI.val()])
							.prop( 'animation_duration', parseInt( animTimeI.val()||500 ));
					} catch ( e ) {
						itg.error( e );
					}
				};
			})(),
			$demotip = $( '#qtip-exampleStyle' );
		$( '#qtiprounded,#qtipshadow,#qtipstyle' ).bind( events, ( function updateStyleWrapper() {
			var styleI = $( '#qtipstyle' ),
				shadowI = $( '#qtipshadow' ),
				roundedI = $( '#qtiprounded' );
			return function updateStyle( event, themename ) {
				if ( 'undefined' == typeof themename ) {
					themename = styleI.val();
				}
				var style = [
					'ithoughts_tt_gl-tooltip',
					'qtip-pos-br',
				];
				if ( shadowI.is( ':checked' )) {
					style.push( 'qtip-shadow' );
				}
				if ( roundedI.is( ':checked' )) {
					style.push( 'qtip-rounded' );
				}
				itg.updateStyle( style, $( '#qtipstyle' ).val(), $demotip );
			};
		})());
		$( '#tooltips,#qtiptrigger,#anim_in,#anim_out,#anim_time' ).bind( events, updateActivationPreview );
		( function doWrapInit() {
			var verbosityInput = $( '#verbosity' ),
				verbosityLabel = $( '#ithoughts_tt_gl-verbosity_label' ),
				verbosityLabels = verbosityLabel.data( 'labels' );
			verbosityInput.on( 'input', function onInput() {
				verbosityLabel.text( verbosityLabels[$( this ).val()]);
			}).trigger( 'input' );
		}());
	});
})( iThoughts.v5 );

},{}]},{},[1]);
