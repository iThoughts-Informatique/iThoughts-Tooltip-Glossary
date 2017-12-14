"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		'use strict';

		var htmlAttrs = ['href', 'title'];

		var maybePrefixAttribute = function maybePrefixAttribute(attrName) {
			// If the key is not an HTML attribute and is not `data-` prefixed, prefix it
			if (!htmlAttrs.includes(attrName) && !attrName.startsWith('data-')) {
				return "data-" + attrName;
			} else {
				return attrName;
			}
		};

		var extractAttrs = function extractAttrs(node) {
			var ret = {};
			Array.prototype.slice.call(node.attributes, 0).forEach(function (attr) {
				ret[attr.nodeName] = attr.nodeValue;
			});
			return ret;
		};

		var generateTakeAttr = function generateTakeAttr(attrs) {
			// If we received a node instead of an object, extract its attributes
			if (attrs.tagName) {
				attrs = extractAttrs(attrs);
			}
			// Return the picker function
			return function (label, defaultValue) {
				var noDataPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

				if (!noDataPrefix) {
					label = maybePrefixAttribute(label);
				}
				if (attrs.hasOwnProperty(label)) {
					var val = attrs[label];
					delete attrs[label];
					return val;
				} else {
					return defaultValue;
				}
			};
		};

		var get = function get(object, path, defaultValue) {
			var defaulted = false;
			path.forEach(function (segment) {
				if (typeof object !== 'undefined' && object.hasOwnProperty(segment)) {
					object = object[segment];
				} else {
					defaulted = true;
				}
			});
			if (defaulted) {
				return defaultValue;
			} else {
				return object;
			}
		};

		var isTrueValue = function isTrueValue(val) {
			if (typeof val === 'string' && (val === '1' || val.toLowerCase() === 'true')) {
				return true;
			} else if (typeof val === 'number') {
				return val > 0;
			}
			return false;
		};

		var htmlEncode = function htmlEncode(str) {
			return $('<textarea />').text(str).html();
		};
		var htmlDecode = function htmlDecode(str) {
			return $('<textarea />').html(str).text();
		};

		module.exports = {
			maybePrefixAttribute: maybePrefixAttribute,
			extractAttrs: extractAttrs,
			generateTakeAttr: generateTakeAttr,
			get: get,
			isTrueValue: isTrueValue,
			htmlEncode: htmlEncode,
			htmlDecode: htmlDecode
		};
	}, {}], 2: [function (require, module, exports) {
		/**
   * @file Interface between plugin formatted data and qTip API
   *
   * @author Gerkin
   * @copyright 2016 GerkinDevelopment
   * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
   * @package ithoughts-tooltip-glossary
   *
   * @version 2.7.0
   */

		'use strict';

		var comon = require('./comon');
		var OptArray = require('./optarray');

		var ithoughts = iThoughts.v5;
		var itg = iThoughtsTooltipGlossary;

		var $ = ithoughts.$,
		    $w = ithoughts.$w,
		    $d = ithoughts.$d,
		    isNA = ithoughts.isNA;

		var extend = $.extend;

		var $tooltipsContainer = $($.parseHTML("<div id=\"itg-tipsContainer\" class=\"itg-tipsContainer\"></div>"));
		$(document.body).append($tooltipsContainer);
		var types = ['glossary', 'tooltip', 'mediatip'];

		var redimWait = void 0;

		ithoughts.initLoggers(itg, 'iThoughts Tooltip Glossary', itg.verbosity);

		/**
  	 * @function replaceQuotes
  	 * @description Encode or decode string with pseudo-html encoded quote
  	 * @memberof ithoughts_tooltip_glossary
  	 * @param {string} string String to encode or decode
  	 * @param {boolean} encode True to encode, false to decode
  	 * @returns {string} Encoded or decoded string
  	 * @author Gerkin
  	 */
		itg.replaceQuotes = function (string, encode) {
			if (typeof string != 'string') {
				return '';
			}
			if (encode) {
				return string.replace(/"/g, '&aquot;').replace(/\n/g, '<br/>');
			} else {
				return string.replace(/<br\/>/g, '\n').replace(/&aquot;/g, '"');
			}
		};

		var linksTouch = new Map();
		var linksExpanded = new WeakMap();
		$('body').bind('click touch', function (event) {
			linksTouch.forEach(function (touch, link) {
				var $link = $(link);
				if (0 === $(event.target).closest($link).length) {
					linksExpanded.set(link, false);
					$link.triggerHandler('responsiveout');
				}
			});
		});

		var qTipEventHandlers = {
			click: {
				in: function _in(event) {
					if (linksTouch.get(this) !== 1) {
						event.preventDefault();
						linksTouch.set(this, 1);
					}
				},
				out: function out(event) {
					linksTouch.set(this, 0);
				}
			},
			responsive: {
				tap: function tap(event) {
					if (!linksExpanded.get(this) && linksTouch.get(this) !== 0) {
						linksExpanded.set(this, true);
						$(this).triggerHandler('responsive');
						event.preventDefault();
					}
				},
				touchstart: function touchstart() {
					linksTouch.set(this, 1);
				},
				touchend: function touchend() {
					linksTouch.set(this, 2);
				},
				mousein: function mousein() {
					$(this).triggerHandler('responsive');
				},
				mouseout: function mouseout() {
					$(this).triggerHandler('responsiveout');
				}
			}
		};

		var doTipRender = function doTipRender(renderFcts, props, event, api) {
			var _this = this;

			$(this).css({
				maxWidth: props.maxWidth
			});
			$(this).prop('animation_duration', props.animDuration);
			renderFcts.forEach(function (renderFct) {
				return renderFct.call(_this, event, api);
			});
			if (itg.renderHooks) {
				itg.renderHooks.forEach(function (hook) {
					return hook.call(_this, event, api);
				});
			}
		};
		var getRedimInfos = function getRedimInfos(element) {
			if (1 === element.length && ('IFRAME' === element[0].nodeName && element[0].src.match(/youtube|dailymotion/) || 'VIDEO' === element[0].nodeName)) {
				return redimVid(element);
			} else {
				itg.warn('Not an IFRAME from youtube OR a VIDEO', element);
			}
		};
		var bindLockOnPinClick = function bindLockOnPinClick(event, api) {
			// Grab the tooltip element from the API elements object
			// Notice the 'tooltip' prefix of the event name!
			api.elements.title.find(".itg_pin_container").click(function clickPinKeepOpen() {
				if ($(this).toggleClass('pined').hasClass('pined')) {
					api.disable();
				} else {
					api.enable();
				}
			});
		};

		var defaultComonTipOptions = {
			prerender: false,
			suppress: false,
			position: {
				viewport: $('body'), // Keep the tooltip on-screen at all times
				effect: false, // Disable positioning animation
				container: $tooltipsContainer
			},
			show: {
				solo: true // Only show one tooltip at a time
			},
			hide: {
				leave: false
			}
		};

		/**
   * @function doInitTooltips
   * @description Init all tooltips
   * @returns {undefined}
   * @author Gerkin
   */
		itg.doInitTooltips = function () {
			var evts = {
				start: ithoughts.isIos ? 'mousedown' : 'touchstart',
				end: ithoughts.isIos ? 'mouseup' : 'touchend'
			};
			if (ithoughts.isIos) {
				$('body').css({
					cursor: 'pointer'
				});
			}

			// Get all tooltips spans
			var $tooltipLinks = $(types.map(function (type) {
				return "a.itg-" + type;
			}).join(','));
			itg.log('Having following elements to init tooltpis on: ', $tooltipLinks);

			$tooltipLinks.each(function (index, tooltipLink) {
				var takeAttr = comon.generateTakeAttr(tooltipLink);
				// ## Init tooltip
				var $tooltipLink = $(tooltipLink);

				var renderFcts = [];
				var qTipConfigComponents = [];

				/* Use provided data or use the default settings */
				var qtiptrigger = takeAttr('qtiptrigger', itg.qtiptrigger);
				qTipConfigComponents.push({
					show: { event: qtiptrigger },
					hide: { event: 'responsive' === qtiptrigger ? 'responsiveout' : 'mouseleave' }
				});
				if ('click' === qtiptrigger) {
					$tooltipLink.click(qTipEventHandlers.click.in).mouseleave(qTipEventHandlers.click.out);
				} else if ('responsive' === qtiptrigger) {
					linksTouch.set(tooltipLink, ithoughts.baseTouch);
					//Detect touch/click out
					$tooltipLink.click(qTipEventHandlers.responsive.tap).bind(evts.start, qTipEventHandlers.responsive.touchstart).bind(evts.end, qTipEventHandlers.responsive.touchend).bind('mouseover focus', qTipEventHandlers.responsive.mousein).bind('mouseleave focusout', qTipEventHandlers.responsive.mouseout);
				}

				qTipConfigComponents.push({
					show: {
						effect: comon.get(itg.animationFunctions.in, [takeAttr('animation_in', 'none')], itg.animationFunctions.in.none)
					},
					hide: {
						effect: comon.get(itg.animationFunctions.out, [takeAttr('animation_out', 'none')], itg.animationFunctions.in.none)
					}
				});

				var tipStyle = takeAttr('tip-style', itg.qtipstyle);
				var classes = takeAttr('tip-classes', '');
				var tipShadow = takeAttr('tip-shadow', itg.qtipshadow);
				var tipRounded = takeAttr('tip-rounded', itg.qtiprounded);

				qTipConfigComponents.push({
					position: {
						at: takeAttr('position-at', 'top center'), // Position the tooltip above the link
						my: takeAttr('position-my', 'bottom center') // The tip corner goes down
					},
					events: {
						render: doTipRender.bind(null, renderFcts, {
							maxWidth: takeAttr('tip-maxwidth'),
							animDuration: takeAttr('anim-duration', itg.anims.duration)
						})
					}
				});

				var title = takeAttr('title', tooltipLink.textContent);
				var content = void 0;
				var tipClasses = classes.split(/\s+/).concat(["qtip-" + tipStyle, tipShadow ? 'qtip-shadow' : false, tipRounded ? ' qtip-rounded' : false]);

				if ($tooltipLink.hasClass('itg-glossary')) {
					// ### Glossary tips
					itg.info('Do init a GLOSSARYTIP');
					tipClasses.push('itg-glossary');
					var contenttype = takeAttr('glossary-contenttype', itg.contenttype);
					if (contenttype !== 'off') {
						var glossaryId = takeAttr('glossary-id');
						var glossaryContent = takeAttr('glossary-content');
						if (!isNA(glossaryId)) {
							// Define the `ajaxPostData` that will be used bellow to send the request to the API
							var ajaxPostData = {
								action: 'ithoughts_tt_gl_get_term_details',
								content: contenttype,
								glossaryId: glossaryId,
								_ajax_nonce: itg.nonce
							};
							// If WPML is installed, the tooltip editor allow the user to check the *disable auto translation* option, and this option should be used when querying the API
							if ('true' === takeAttr('disable_auto_translation')) {
								ajaxPostData['disable_auto_translation'] = true;
							}
							// #### Load via Ajax
							content = itg.lang.qtip.pleasewait_ajaxload.content, qTipConfigComponents.push({ content: {
									ajax: {
										// Use the [admin_ajax](http://www.google.com) endpoint provided by wordpress
										url: itg.admin_ajax,
										type: 'GET',
										// `ajaxPostData` was defined [above](#)
										data: ajaxPostData,
										loading: false,
										// Display the received content on success, or `Error`
										success: function success(resp) {
											if (resp.data && resp.data.refresh_nonce) {
												itg.nonce = resp.data.refresh_nonce;
											}
											if (resp.success) {
												this.set('content.title', resp.data.title);
												this.set('content.text', resp.data.content);
											} else {
												this.set('content.text', 'Error');
											}
										}
									}
								} });
						} else if (!isNA(glossaryContent)) {
							// #### Static term
							content = glossaryContent;
						}
					}
				} else if ($tooltipLink.hasClass("itg-tooltip")) {
					// ### Tooltip
					itg.info('Do init a TOOLTIP');
					tipClasses.push('itg-tooltip');
					content = itg.replaceQuotes(takeAttr('tooltip-content', ''), false);
				} else if ($tooltipLink.hasClass("itg-mediatip")) {
					// ### Mediatip
					itg.info('Do init a MEDIATIP');
					tipClasses.push('itg-mediatip');
					qTipConfigComponents.push({
						position: {
							adjust: {
								scroll: false
							}
						},
						events: {
							show: function show() {
								$tooltipLink.qtip().reposition();
							}
						}
					});

					var type = takeAttr('mediatip-type', false);
					var source = takeAttr('mediatip-source');

					var caption = takeAttr('mediatip-caption', '');
					if (caption) {
						content = "<div class=\"ithoughts_tt_gl-caption\">" + itg.replaceQuotes(caption, false) + "</div>";
					}

					switch (type) {
						case 'localimage':
						case 'webimage':
							{
								// #### Image
								var attrs = new OptArray({
									src: source,
									alt: title
								});
								var filters = comon.get(itg, ['qtip_filters', 'mediatip'], []);
								filters.forEach(function (filter) {
									extend(attrs.opts, filter.call(attrs.opts));
								});

								content = "<img " + attrs.toString() + ">" + content;
							}break;

						case 'webvideo':
							{
								var replacedText = itg.replaceQuotes(comon.htmlDecode(source).trim(), false);
								var $video = $($.parseHTML(replacedText));
								var redimedInfos = getRedimInfos($video);
								renderFcts.push(bindLockOnPinClick);
								console.log(redimedInfos);
								// #### Iframe / HTML
								content = "" + redimedInfos['text'] + content;
								title = "<span class=\"itg_pin_container\"><svg viewBox=\"0 0 26 26\" class=\"itg_pin\"><use xlink:href=\"#icon-pin\"></use></svg></span><span class=\"ithoughts_tt_gl-title_with_pin\">" + title + "</span>";
								qTipConfigComponents.push({ style: {
										width: redimedInfos['dims']['width']
									} });
								tipClasses.push('itg-mediatip', 'ithoughts_tt_gl-force_no_pad', 'ithoughts_tt_gl-video_tip', 'ithoughts_tt_gl-with_pin');
							}break;
					}
				} else {
					return;
				}

				// ## Override defaults
				if ('true' === $tooltipLink.data('tip-autoshow')) {
					qTipConfigComponents.push({ show: {
							ready: true
						} });
				}
				if ('true' === $tooltipLink.data('tip-nosolo')) {
					qTipConfigComponents.push({ show: {
							solo: false
						} });
				}
				if ('true' === $tooltipLink.data('tip-nohide')) {
					qTipConfigComponents.push({
						hide: 'someevent',
						show: {
							event: 'someevent'
						}
					});
				}
				if ($tooltipLink.data('tip-id')) {
					qTipConfigComponents.push({ id: $tooltipLink.data('tip-id') });
				}
				if ($tooltipLink.data('qtip-keep-open') || $tooltipLink.hasClass("itg-mediatip")) {
					qTipConfigComponents.push({ hide: {
							fixed: true,
							delay: 250
						} });
				}
				if ('true' === $tooltipLink.data('tip-prerender')) {
					qTipConfigComponents.push({
						prerender: true
					});
				}

				var tooltipOpts = extend.apply(undefined, [true, {}].concat(qTipConfigComponents, [{
					content: {
						title: title,
						text: content
					},
					style: {
						classes: tipClasses.filter(function (v) {
							return !!v;
						}).join(' ')
					}
				}]));

				itg.log('Final tooltip options: ', tooltipLink, tooltipOpts);

				$tooltipLink.qtip(tooltipOpts);

				//Remove title for tooltip, causing double tooltip
				$tooltipLink.removeAttr('title');
			});
		};

		function dom2string(who) {
			var tmp = $(document.createElement('div'));
			$(tmp).append($(who));
			tmp = tmp.html();
			return tmp;
		}

		$w.resize(function waitStopRedimVideoRedim() {
			clearTimeout(redimWait);
			redimWait = setTimeout(redimVid, 100);
		});
		function redimVid(video) {
			var h = $w.height(),
			    w = $w.width(),
			    i = 0,
			    dims = [[512, 288], [256, 144]],
			    l = dims.length;
			for (; i < l; i++) {
				if (w > dims[i][0] && h > dims[i][1]) {
					break;
				}
			}
			i = Math.min(dims.length, Math.max(0, i));
			var optDims = dims[i];
			if ('undefined' === typeof video && typeof optDims !== 'undefined') {
				$('.ithoughts_tt_gl-video').prop({
					width: optDims[0],
					height: optDims[1]
				});
				$('.ithoughts_tt_gl-video_tip').each(function replaceVideoTip() {
					var api = $(this).qtip('api'); /**/
					var state = api.disabled;
					api.enable(); /**/
					api.reposition(); /**/
					api.disable(state); /**/
				}).css({
					width: optDims[0],
					height: optDims[1]
				});
			} else if (!ithoughts.isNA(video)) {
				video.prop({
					width: optDims[0],
					height: optDims[1]
				}).addClass('ithoughts_tt_gl-video');
				return {
					dims: {
						width: optDims[0],
						height: optDims[1]
					},
					text: dom2string(video)
				};
			}
		}

		$d.ready(function onDocumentReady() {
			itg.doInitTooltips();
		});

		extend($.easing, {
			/**
   	 * @function easeInBack
   	 * @memberof jQuery.easing
   	 * @description jQuery-UI easeInBack easing function
   	 * @author jQuery
   	 * @param   {number} x(unknown)
   	 * @param   {number} t Current time
   	 * @param   {number} b Time of begin
   	 * @param   {number} c Direction (must be 1 or -1)
   	 * @param   {number} d Duration
   	 * @param   {number} s (unknown)
   	 * @returns {number} Value ponderated
   	 */
			easeInBack: function easeInBack(x, t, b, c, d, s) {
				if (null == s) {
					s = 1.70158;
				}
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			/**
   	 * @function easeOutBack
   	 * @memberof jQuery.easing
   	 * @description jQuery-UI easeOutBack easing function
   	 * @author jQuery
   	 * @param   {number} x(unknown)
   	 * @param   {number} t Current time
   	 * @param   {number} b Time of begin
   	 * @param   {number} c Direction (must be 1 or -1)
   	 * @param   {number} d Duration
   	 * @param   {number} s (unknown)
   	 * @returns {number} Value ponderated
   	 */
			easeOutBack: function easeOutBack(x, t, b, c, d, s) {
				if (null == s) {
					s = 1.70158;
				}
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			}
		});

		// ------
		// ## Definition of default animations

		itg.animationFunctions = extend(true, itg.animationFunctions, {
			in: {
				/**
    	 * @function none
    	 * @description Makes the tip appear without any transition
    	 * @memberof ithoughts_tooltip_glossary.anim.in
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				none: function none() {
					$(this).show();
				},
				/**
    	 * @function zoomin
    	 * @description Zoom on the tip: at start, it is invisible because small, at end, it is at normal size
    	 * @memberof ithoughts_tooltip_glossary.anim.in
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				zoomin: function zoomin(qtip) {
					var $tooltip = $(this),
					    $tip = qtip.elements.tip;
					$tooltip.prop('scale_start', $tooltip.prop('scale') || 0);
					$tooltip.show().animate({
						z: 1
					}, {
						progress: function progress(infos, percent, timeLeft) {
							var factorProgress = $.easing.swing(percent, infos.duration - timeLeft, 0, 1, infos.duration),
							    origFactor = $tooltip.prop('scale_start') * (1 - factorProgress),
							    destFactor = 1 * factorProgress,
							    scale = origFactor + destFactor;
							if (scale !== 1 && scale !== 0) {
								$tooltip.prop('scale', scale);
							}
							var advance = "scale(" + scale + ")",
							    origin = $tip.css(['left', 'top']);
							origin = origin.left + " " + origin.top + " 0";
							$tooltip.css({
								'-webkit-transform': advance,
								'-moz-transform': advance,
								'transform': advance,
								'-ms-transform-origin': origin,
								'-webkit-transform-origin': origin,
								'transform-origin': origin
							});
						},
						duration: $tooltip.prop('animation_duration'),
						done: function done(promise, killed) {
							if (isNA(killed) || !killed) {
								$tooltip.prop('scale', null);
								$tooltip.css({
									'-webkit-transform': '',
									'-moz-transform': '',
									'transform': '',
									'-ms-transform-origin': '',
									'-webkit-transform-origin': '',
									'transform-origin': ''
								});
							}
						}
					});
				},
				/**
    	 * @function appear
    	 * @description Simple opacity transition
    	 * @memberof ithoughts_tooltip_glossary.anim.in
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				appear: function appear() {
					var $tooltip = $(this);
					$tooltip.css({
						display: 'block',
						opacity: 0
					}).animate({
						opacity: 1
					}, {
						easing: 'swing',
						duration: $tooltip.prop('animation_duration')
					});
				}
			},
			out: {
				/**
    	 * @function none
    	 * @description Makes the tip disappear without any transition
    	 * @memberof ithoughts_tooltip_glossary.anim.out
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				none: function none() {},
				/**
    	 * @function unhook
    	 * @description Makes the tip go a bit up then down with transparency
    	 * @memberof ithoughts_tooltip_glossary.anim.out
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				unhook: function unhook() {
					var $tooltip = $(this);
					$tooltip.animate({
						opacity: 0,
						top: '+=50'
					}, {
						easing: 'easeInBack',
						duration: $tooltip.prop('animation_duration')
					});
				},
				/**
    	 * @function flee
    	 * @description Go a bit to right, then fast to left
    	 * @memberof ithoughts_tooltip_glossary.anim.out
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				flee: function flee() {
					var $tooltip = $(this);
					$tooltip.animate({
						opacity: 0,
						left: -100
					}, {
						easing: 'easeInBack',
						duration: $tooltip.prop('animation_duration')
					});
				},
				/**
    	 * @function zoomout
    	 * @description Reduces the size of the tip until 0
    	 * @memberof ithoughts_tooltip_glossary.anim.out
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				zoomout: function zoomout(qtip) {
					var $tooltip = $(this),
					    $tip = qtip.elements.tip;
					$tooltip.prop('scale_start', $tooltip.prop('scale') || 1);
					$tooltip.animate({
						z: 1
					}, {
						progress: function progress(infos, percent, timeLeft) {
							var factorProgress = $.easing.swing(percent, infos.duration - timeLeft, 0, 1, infos.duration),
							    origFactor = $tooltip.prop('scale_start') * (1 - factorProgress),
							    destFactor = 0,
							    scale = origFactor + destFactor;
							if (scale !== 1 && scale !== 0) {
								$tooltip.prop('scale', scale);
							}
							var advance = "scale(" + scale + ")",
							    origin = $tip.css(['left', 'top']);
							origin = origin.left + " " + origin.top + " 0";
							$tooltip.css({
								'-webkit-transform': advance,
								'-moz-transform': advance,
								'transform': advance,
								'-ms-transform-origin': origin,
								'-webkit-transform-origin': origin,
								'transform-origin': origin
							});
						},
						duration: $tooltip.prop('animation_duration'),
						done: function done(promise, killed) {
							if (isNA(killed) || !killed) {
								$tooltip.prop('scale', null);
								$tooltip.css({
									'-webkit-transform': '',
									'-moz-transform': '',
									'transform': '',
									'-ms-transform-origin': '',
									'-webkit-transform-origin': '',
									'transform-origin': ''
								});
							}
						}
					});
				},
				/**
    	 * @function disappear
    	 * @description Simple opacity transition
    	 * @memberof ithoughts_tooltip_glossary.anim.out
    	 * @param {QTip} qtip Tooltip provided by qTip call
    	 * @returns {undefined}
    	 * @author Gerkin
    	 */
				disappear: function disappear() {
					var $tooltip = $(this);
					$tooltip.animate({
						opacity: 0
					}, {
						easing: 'swing',
						duration: $tooltip.prop('animation_duration')
					});
				}
			}
		});
	}, { "./comon": 1, "./optarray": 3 }], 3: [function (require, module, exports) {
		'use strict';

		var _iThoughtsTooltipGlos = iThoughtsTooltipGlossary,
		    replaceQuotes = _iThoughtsTooltipGlos.replaceQuotes;
		var isNA = iThoughts.v5.isNA;

		var OptArray = function () {
			function OptArray(opts) {
				_classCallCheck(this, OptArray);

				this.opts = {};
				for (var key in opts) {
					this.addOpt(key, opts[key]);
				}
			}

			_createClass(OptArray, [{
				key: "addOpt",
				value: function addOpt(label, value) {
					var specEncode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

					label = replaceQuotes(label.trim(), true);
					if (!label.match(/^[\w_\-]*$/)) {
						return this;
					}

					value = String(value).trim();
					value = !isNA(specEncode) && specEncode ? value.replace(/"/g, '&aquot;').replace(/\n/g, '<br/>') : replaceQuotes(value, true);

					this.opts[label] = value;
				}
			}, {
				key: "maybeAddOpt",
				value: function maybeAddOpt(addValue, name, value) {
					if (addValue) {
						this.addOpt(name, value);
					}
				}
			}, {
				key: "toString",
				value: function toString() {
					var _this2 = this;

					return Object.keys(this.opts).map(function (key) {
						return OptArray.generateAttr(key, _this2.opts[key]);
					}).join(' ');
				}
			}], [{
				key: "generateAttr",
				value: function generateAttr(label, value) {
					return label + "=\"" + value + "\"";
				}
			}]);

			return OptArray;
		}();

		module.exports = OptArray;
	}, {}] }, {}, [2]);
//# sourceMappingURL=main.js.map
