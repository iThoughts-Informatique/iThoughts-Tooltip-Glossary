/**
 * @file Javascript handler for A-to-Z lists
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
	
	var lastPos,
        $ = ithoughts.$,
        $w = ithoughts.$w;

	ithoughts.$d.ready(function(){

		var preventHashChange = false;
		// Handle clicking
		$('.itg-atoz-clickable').click(function(){
			// Keep track of the scroll
			lastPos = $w.scrollTop();
			$(this).removeClass('itg-atoz-menu-off').addClass('itg-atoz-menu-on');
			$('.itg-atoz-clickable').removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
			var alpha = $(this).data('alpha');
			preventHashChange = true;
			location.hash = alpha;

			var $parent = $(this).parent().parent();
			$parent.find('.glossary-atoz').removeClass('itg-atoz-items-on').addClass('itg-atoz-items-off');
			$parent.find('.glossary-atoz-' + alpha).removeClass('itg-atoz-items-off').addClass('itg-atoz-items-on');
			$parent.find('.ithoughts_tt_gl-please-select').hide();
		});

		// Manual hash change - trigger click
		$w.bind('hashchange',function(event){
			if(preventHashChange){
				preventHashChange = false;
			} else {
				var alpha = location.hash.replace('#','');
				$w.scrollTop(lastPos);
				location.hash = alpha;
				$('.itg-atoz-clickable').filter(function(i){return $(this).data('alpha') == alpha;}).click();
				$('.ithoughts_tt_gl-please-select').hide();
			}
		});

		// Page load hash management:
		//  - Look for first available if none specified
		//  - Trigger click if exists
		var myLocation = document.location.toString(),
			myAlpha    = '';
		if( myLocation.match('#') )
			myAlpha = myLocation.split('#')[1];
		if( ! myAlpha.length ){
			//myAlpha = $('.itg-atoz-clickable:eq(0)').data('alpha');
			$('.glossary-atoz').removeClass('itg-atoz-items-on').addClass('itg-atoz-items-off');
			$('.itg-atoz-clickable').removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
			$('.ithoughts_tt_gl-please-select').show();
		}
		if( myAlpha.length ){
			$('.ithoughts_tt_gl-please-select').hide();
			$('.itg-atoz-clickable').filter(function(i){return $(this).data('alpha') == myAlpha;}).click();
		}
	});
})(Ithoughts.v4);