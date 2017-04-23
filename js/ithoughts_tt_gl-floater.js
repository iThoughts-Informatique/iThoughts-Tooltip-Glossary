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

(function(ithoughts){
	'use strict';

	var $ = ithoughts.$,
		$d = ithoughts.$d,
		$w = ithoughts.$w;

	$d.ready(function(){

		ithoughts_tt_gl.updateStyle = (function(){
			var styleI = $('#qtipstyle'),
				shadowI = $('#qtipshadow'),
				roundedI = $('#qtiprounded');
			return function(event, themename, target){
				if(typeof themename == 'undefined')
					themename = styleI.val();
				var style = [
					'ithoughts_tt_gl-tooltip',
					'qtip-pos-br',
					'qtip-'+themename,
				];
				if(shadowI.is(':checked'))
					style.push('qtip-shadow');
				if(roundedI.is(':checked'))
					style.push('qtip-rounded');
				target.qtip('option', 'style.classes', style.join(' '));
			};
		})();

		var updateFloaterPosition = (function(){
			var min,
				centerOffset,
				max;
			return function(event,floaterObj, redim){
				if(redim === true || typeof min === 'undefined' || typeof max === 'undefined' || typeof centerOffset === 'undefined'){
					min = floaterObj.container.offset().top;
					max = floaterObj.container.outerHeight(true) - floaterObj.body.outerHeight(true);
					centerOffset = ($w.outerHeight(true) - floaterObj.body.outerHeight(true)) / 2;
				}
				var baseOffset = $w.scrollTop() - min;
				var offset = Math.min(Math.max(baseOffset + centerOffset,0), max);
				floaterObj.body.css('top', offset + 'px');
			};
		})();

		var floater = {body: $('#floater')};
		floater['container'] = floater.body.parent();
		floater.body.css('position','absolute');
		$d.scroll(function(e){updateFloaterPosition(e,floater);});
		$w.resize(function(e){updateFloaterPosition(e,floater, true);}).resize();
		window.refloat = function(){
			setTimeout(function(){/*
                if($(elem).parent().prop('id') === 'ithoughts_tt_gllossary_options_2')
                    $('#qtip-exampleStyle').qtip('api').toggle(!$(elem).parent().hasClass('closed'));*/
				updateFloaterPosition(null,floater,true);
				$w.scroll();
			}, 25);
		};
	});
})(Ithoughts.v4);