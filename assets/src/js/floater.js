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

const ithoughts = iThoughts.v5;

const {
	$, $d, $w,
} = ithoughts;

const initFloater = () => {
	const updateFloaterPosition = (() => {
		let min;
		let centerOffset;
		let max;
		return ( event, floaterObj, redim ) => {
			if ( true === redim || 'undefined' === typeof min || 'undefined' === typeof max || 'undefined' === typeof centerOffset ) {
				min = floaterObj.container.offset().top;
				max = floaterObj.container.outerHeight( true ) - floaterObj.body.outerHeight( true );
				centerOffset = ( $w.outerHeight( true ) - floaterObj.body.outerHeight( true )) / 2;
			}
			const baseOffset = $w.scrollTop() - min;
			const offset = Math.min( Math.max( baseOffset + centerOffset, 0 ), max );
			floaterObj.body.css( 'top', `${ offset  }px` );
		};
	})();

	const floater = {
		body: $( '#floater' ).css( 'position', 'absolute' ),
	};
	floater.container = floater.body.parent();
	$d.scroll( event => {
		updateFloaterPosition( event, floater );
	});
	$w.resize( event => {
		updateFloaterPosition( event, floater, true );
	}).resize();
	global.refloat = () => {
		setTimeout(() => {
			updateFloaterPosition( null, floater, true );
			$w.scroll();
		}, 25 );
	};
};

module.exports = initFloater;
