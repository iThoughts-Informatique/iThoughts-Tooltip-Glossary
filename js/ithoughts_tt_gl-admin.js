/**
 * @file Old file. To merge
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 */

(function(ithoughts){
	'use strict';
	var $ = ithoughts.$,
		i_t_g = ithoughts_tt_gl;

	ithoughts.$d.ready(function(){
		var u = i_t_g.updateStyle,
			e = "change blur keyup mouseup",
			updateActivationPreview = (function(){
				var triggerI = $("#qtiptrigger"),
					animInI = $("#anim_in"),
					animOutI = $("#anim_out"),
					animTimeI = $("#anim_time");
				return function(){
					var trigger = triggerI.val();
					try{
						$demotip
							.qtip('option', 'show.event', trigger)
							.qtip('option', 'hide.event', (trigger == 'responsive') ? "responsiveout" : 'mouseleave')
							.qtip('option', 'show.effect', i_t_g.animationFunctions.in[animInI.val()])
							.qtip('option', 'hide.effect', i_t_g.animationFunctions.out[animOutI.val()])
							.prop("animation_duration", parseInt(animTimeI.val()||500));
					} catch(e){
						console.error(e);
					}
				}
			})(),
			$demotip = $("#qtip-exampleStyle");
		$("#qtiprounded,#qtipshadow,#qtipstyle").bind(e, function(e){u(e, $("#qtipstyle").val(), $demotip);});
		$("#tooltips,#qtiptrigger,#anim_in,#anim_out,#anim_time").bind(e, updateActivationPreview);
	});
})(Ithoughts.v3);
