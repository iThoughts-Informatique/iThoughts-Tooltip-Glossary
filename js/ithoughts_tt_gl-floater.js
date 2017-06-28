/**
 * @file Cross-Browser firefox's "sticky" position for demo tooltip
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
		$d = ithoughts.$d,
		$w = ithoughts.$w;

	$d.ready( function onDocumentReady() {

		iThoughtsTooltipGlossary.updateStyle = ( function updateStyleWrapper() {
			var styleI = $( '#qtipstyle' ),
				shadowI = $( '#qtipshadow' ),
				roundedI = $( '#qtiprounded' );
			return function updateStyle( event, themename, target ) {
				if ( 'undefined' == typeof themename )					{
					themename = styleI.val();
				}
				var style = [
					'ithoughts_tt_gl-tooltip',
					'qtip-pos-br',
					`qtip-${ themename }`,
				];
				if ( shadowI.is( ':checked' ))					{
					style.push( 'qtip-shadow' );
				}
				if ( roundedI.is( ':checked' ))					{
					style.push( 'qtip-rounded' );
				}
				target.qtip( 'option', 'style.classes', style.join( ' ' ));
			};
		})();

		var updateFloaterPosition = ( function updateFloaterPositionWrapper() {
			var min,
				centerOffset,
				max;
			return function updateFloaterPosition( event, floaterObj, redim ) {
				if ( true === redim || 'undefined' === typeof min || 'undefined' === typeof max || 'undefined' === typeof centerOffset ) {
					min = floaterObj.container.offset().top;
					max = floaterObj.container.outerHeight( true ) - floaterObj.body.outerHeight( true );
					centerOffset = ( $w.outerHeight( true ) - floaterObj.body.outerHeight( true )) / 2;
				}
				var baseOffset = $w.scrollTop() - min;
				var offset = Math.min( Math.max( baseOffset + centerOffset, 0 ), max );
				floaterObj.body.css( 'top', `${ offset  }px` );
			};
		})();

		var floater = {
			body: $( '#floater' ),
		};
		floater['container'] = floater.body.parent();
		floater.body.css( 'position', 'absolute' );
		$d.scroll( function onScroll( e ) {
			updateFloaterPosition( e, floater );
		});
		$w.resize( function onResive( e ) {
			updateFloaterPosition( e, floater, true );
		}).resize();
		window.refloat = function refloat() {
			setTimeout( function refloatTimeout() {
				updateFloaterPosition( null, floater, true );
				$w.scroll();
			}, 25 );
		};
	});
})( iThoughts.v5 );
