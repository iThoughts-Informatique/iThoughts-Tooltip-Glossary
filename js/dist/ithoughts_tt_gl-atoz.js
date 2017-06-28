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

'use strict';

(function selfCalling(ithoughts) {
	var lastPos,
	    $ = ithoughts.$,
	    $w = ithoughts.$w,
	    pleaseSelect = $('.ithoughts_tt_gl-please-select'),
	    clickable = $('.itg-atoz-clickable');

	function setShow($parent, alpha) {
		var fct1k, fct2k;
		if (alpha) {
			fct1k = 'removeClass';
			fct2k = 'addClass';
		} else {
			fct1k = 'addClass';
			fct2k = 'removeClass';
		}
		$parent.find('.itg-atoz-items')[fct1k]('itg-atoz-items-on')[fct2k]('itg-atoz-items-off');
		$parent.find('.ithoughts_tt_gl-please-select')[alpha ? 'hide' : 'show']();
		if (alpha) {
			$parent.find('.itg-atoz-items-' + alpha).removeClass('itg-atoz-items-off').addClass('itg-atoz-items-on');
		}
	}
	function setCurrentTab(alpha) {
		pleaseSelect.hide();
		clickable.filter(function filterAlphaTab() {
			return $(this).data('alpha') === alpha;
		}).click();
	}
	ithoughts.$d.ready(function onDocumentReady() {
		var preventHashChange = false;
		// Handle clicking
		$('.itg-atoz-clickable').click(function onClickTab() {
			// Keep track of the scroll
			lastPos = $w.scrollTop();
			$(this).removeClass('itg-atoz-menu-off').addClass('itg-atoz-menu-on');
			$('.itg-atoz-clickable').removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
			var alpha = $(this).data('alpha');
			preventHashChange = true;
			location.hash = alpha;

			setShow($(this).parent().parent(), alpha);
		});

		// Manual hash change - trigger click
		$w.bind('hashchange', function onHashChange() {
			if (preventHashChange) {
				preventHashChange = false;
			} else {
				var alpha = location.hash.replace('#', '');
				$w.scrollTop(lastPos);
				location.hash = alpha;
				setCurrentTab(alpha);
			}
		});

		// Page load hash management:
		//  - Look for first available if none specified
		//  - Trigger click if exists
		var myLocation = document.location.toString(),
		    myAlpha = '';
		if (myLocation.match('#')) {
			myAlpha = myLocation.split('#')[1];
		}
		if (!myAlpha.length) {
			$('.itg-atoz-items').removeClass('itg-atoz-items-on').addClass('itg-atoz-items-off');
			clickable.removeClass('itg-atoz-menu-on').addClass('itg-atoz-menu-off');
			$('.ithoughts_tt_gl-please-select').show();
		} else {
			setCurrentTab(myAlpha);
		}
	});
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-atoz.js.map
