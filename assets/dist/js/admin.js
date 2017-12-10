"use strict";

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
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

		(function (ithoughts) {
			var $ = ithoughts.$;
			var itg = iThoughtsTooltipGlossary;

			/**
    * Set the style of the target, appending to a default classes array the *themename*
    *
    * @param  {boolean|string[]} keepDefaults - Set to `true` to use *default styles*. If an array is given, those classes are used as *default*.
    * @param  {string}           themename    - Class name of the theme
    * @param  {jQuery}           target       - QTip holder to edit
    * @returns {undefined} This function does not have any return value.
    */
			itg.updateStyle = function (keepDefaults, themename, target) {
				var styles = ["qtip-" + themename];
				if (true === keepDefaults) {
					// iF we have simply `true`, add default styles
					styles = styles.concat(['ithoughts_tt_gl-tooltip', 'qtip-pos-br']);
				} else if (typeof keepDefaults !== 'undefined' && keepDefaults && 'Array' === keepDefaults.constructor.name) {
					// If having an array, use it as default styles
					styles = styles.concat(keepDefaults);
				}

				target.qtip('option', 'style.classes', styles.join(' '));
			};

			ithoughts.$d.ready(function () {
				// #### Get some DOMs
				// Get the tip and show it
				var $demotip = $('#qtip-exampleStyle').qtip('api').show();
				// Class inputs
				var $styleI = $('#qtipstyle');
				var $shadowI = $('#qtipshadow');
				var $roundedI = $('#qtiprounded');
				// Behavior inputs
				var $triggerI = $('#qtiptrigger');
				var $animInI = $('#anim_in');
				var $animOutI = $('#anim_out');
				var $animTimeI = $('#anim_time');

				var events = 'change blur keyup mouseup';
				ithoughts.$merge($styleI, $shadowI, $roundedI).bind(events, function () {
					var baseStyles = ['ithoughts_tt_gl-tooltip', 'qtip-pos-br'];
					if ($shadowI.is(':checked')) {
						baseStyles.push('qtip-shadow');
					}
					if ($roundedI.is(':checked')) {
						baseStyles.push('qtip-rounded');
					}
					itg.updateStyle(baseStyles, $styleI.val(), $demotip);
				});
				ithoughts.$merge($triggerI, $animInI, $animOutI, $animTimeI).bind(events, function () {
					// Set the demotip as configured in the inputs
					var trigger = $triggerI.val();
					try {
						$demotip.qtip('option', 'show.event', trigger).qtip('option', 'hide.event', 'responsive' === trigger ? 'responsiveout' : 'mouseleave').qtip('option', 'show.effect', itg.animationFunctions.in[$animInI.val()]).qtip('option', 'hide.effect', itg.animationFunctions.out[$animOutI.val()]).prop('animation_duration', parseInt($animTimeI.val() || 500));
					} catch (error) {
						itg.error(error);
					}
				});
				(function () {
					var $verbosityInput = $('#verbosity');
					var $verbosityLabel = $('#ithoughts_tt_gl-verbosity_label');
					var verbosityLabels = $verbosityLabel.data('labels');
					$verbosityInput.on('input', function () {
						$verbosityLabel.text(verbosityLabels[$verbosityInput.val()]);
					}).trigger('input');
				})();
			});
		})(iThoughts.v5);
	}, {}] }, {}, [1]);
//# sourceMappingURL=admin.js.map
