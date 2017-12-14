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
		'use strict';

		var htmlAttrs = ['href'];

		var maybePrefixAttribute = function maybePrefixAttribute(attrName) {
			// If the key is not an HTML attribute and is not `data-` prefixed, prefix it
			if (!htmlAttrs.includes(attrName) && !attrName.startsWith('data-')) {
				return " data-" + attrName;
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
			return function (label, defaultVal) {
				var noDataPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

				if (!noDataPrefix) {
					label = maybePrefixAttribute(label);
				}
				if (attrs.hasOwnProperty(label)) {
					var val = attrs[label];
					delete attrs[label];
					return val;
				} else {
					return defaultVal;
				}
			};
		};

		module.exports = {
			maybePrefixAttribute: maybePrefixAttribute,
			extractAttrs: extractAttrs,
			generateTakeAttr: generateTakeAttr
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

		var qTipEventHandlers = {
			click: {
				in: function _in(event) {
					console.log(arguments, this);
					if (this.touch !== 1) {
						event.preventDefault();
						this.touch = 1;
					}
				},
				out: function out(event) {
					this.touch = 0;
				}
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
				var qtiptrigger = takeAttr('qtiptrigger', itg.qtiptrigger);
				var
				/* Use provided data or use the default settings */
				qtipstyle = takeAttr('qtipstyle', itg.qtipstyle),
				    qtipshadow = takeAttr('qtipshadown', itg.qtipshadown),
				    qtiprounded = takeAttr('qtiprounded', itg.qtiprounded),
				    animIn = takeAttr('animation_in', itg.anims.in),
				    animOut = takeAttr('animation_out', itg.anims.out),
				    renderFcts = [],
				    animDuration = $tooltipLink.data('animation_time') || itg.anims.duration;
				qtipshadow = 'true' === qtipshadow || '1' === qtipshadow;
				qtiprounded = 'true' === qtiprounded || '1' === qtiprounded;
				console.log({
					qtipstyle: qtipstyle,
					qtipshadow: qtipshadow,
					qtiprounded: qtiprounded,
					qtiptrigger: qtiptrigger,
					animIn: animIn,
					animOut: animOut
				});

				// If set to click, disable glossary link and wrap it in 2 step link
				var qTipEvents = {
					show: {
						event: qtiptrigger
					},
					hide: {
						event: 'responsive' === qtiptrigger ? 'responsiveout' : 'mouseleave'
					}
				};
				if ('click' === qtiptrigger) {
					$tooltipLink.click(qTipEventHandlers.click.in).mouseleave(qTipEventHandlers.click.out);
				} else if ('responsive' === qtiptrigger) {
					$tooltipLink.touch = ithoughts.baseTouch;
					//Detect touch/click out
					$('body').bind('click touch', function bodyClickEmitResponsiveOut(event) {
						if (0 === $(event.target).closest($tooltipLink).length) {
							$tooltipLink.data('expanded', false);
							$tooltipLink.triggerHandler('responsiveout');
						}
					});
					$tooltipLink.children('a').click(function doExpandTouched(e) {
						if (!$tooltipLink.data('expanded') && $tooltipLink.touch !== 0) {
							$tooltipLink.data('expanded', true);
							$tooltipLink.triggerHandler('responsive');
							e.preventDefault();
						}
					}).bind(evts.start, function eventStartTouch() {
						$tooltipLink.touch = 1;
					}).bind(evts.end, function eventEndTouch() {
						$tooltipLink.touch = 2;
					});
				}
				$tooltipLink.bind('mouseover focus', function emitResponsive() {
					$tooltipLink.triggerHandler('responsive');
				}).bind('mouseleave focusout', function emitResponsiveOut() {
					$tooltipLink.triggerHandler('responsiveout');
				});

				var tipClass;
				if ($tooltipLink.data('qtipstyle')) {
					tipClass = "qtip-" + $tooltipLink.data('qtipstyle') + (qtipshadow ? ' qtip-shadow' : '') + (qtiprounded ? ' qtip-rounded' : '') + " ";
				} else if ($tooltipLink.data('tooltip-classes')) {
					tipClass = $tooltipLink.data('tooltip-classes');
				} else {
					tipClass = "qtip-" + qtipstyle + (qtipshadow ? ' qtip-shadow' : '') + (qtiprounded ? ' qtip-rounded' : '') + " ";
				}
				var tooltipComon,
				    tooltipTypeSpecific,
				    tooltipOverrides = {};

				// ## Global option
				tooltipComon = {
					prerender: false,
					suppress: false,
					position: {
						at: $tooltipLink.data('position-at') || 'top center', // Position the tooltip above the link
						my: $tooltipLink.data('position-my') || 'bottom center',
						viewport: $('body'), // Keep the tooltip on-screen at all times
						effect: false, // Disable positioning animation
						container: $tooltipsContainer
					},
					show: {
						solo: true, // Only show one tooltip at a time
						effect: itg.animationFunctions.in[animIn] || itg.animationFunctions.in.none
					},
					hide: {
						leave: false,
						effect: itg.animationFunctions.out[animOut] || itg.animationFunctions.in.none
					},
					events: {
						render: function render(event, api) {
							// $tooltipLink refers to the span
							$(this).css({
								maxWidth: $tooltipLink.data('tooltip-maxwidth')
							});
							$(this).prop('animation_duration', animDuration);
							for (var i = 0, j = renderFcts.length; i < j; i++) {
								renderFcts[i](event, api);
							}
							if (itg.renderHooks) {
								for (i = 0, j = itg.renderHooks.length; i < j; i++) {
									itg.renderHooks[i](event, api);
								}
							}
						}
					},
					style: {
						classes: tipClass
					}
				};
				if ($tooltipLink.hasClass("itg-glossary")) {
					// ### Glossary tips
					itg.info('Do init a GLOSSARYTIP');
					if ($tooltipLink.data('termid') && termcontent !== 'off') {
						// Define the `ajaxPostData` that will be used bellow to send the request to the API
						var ajaxPostData = {
							action: 'ithoughts_tt_gl_get_term_details',
							content: termcontent,
							termid: $tooltipLink.data()['termid'],
							_ajax_nonce: itg.nonce
						};
						// If WPML is installed, the tooltip editor allow the user to check the *disable auto translation* option, and this option should be used when querying the API
						if ('true' === $tooltipLink.data('disable_auto_translation')) {
							ajaxPostData['disable_auto_translation'] = true;
						}
						// #### Load via Ajax
						tooltipTypeSpecific = {
							content: {
								// Before doing API call, define the content with `Please wait` texts
								title: {
									text: itg.lang.qtip.pleasewait_ajaxload.title
								},
								text: itg.lang.qtip.pleasewait_ajaxload.content,
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
							},
							// Apply the style settings
							style: {
								classes: tipClass + "itg-glossary"
							}
						};
					} else if ($tooltipLink.data('term-content') && $tooltipLink.data('term-title')) {
						// #### Static term
						tooltipTypeSpecific = {
							content: {
								title: {
									text: $tooltipLink.data('term-title')
								},
								text: $tooltipLink.data('term-content')
							},
							style: {
								classes: tipClass + "itg-glossary"
							}
						};
					}
				} else if ($tooltipLink.hasClass("itg-tooltip")) {
					// ### Tooltip
					itg.info('Do init a TOOLTIP');
					tooltipTypeSpecific = {
						style: {
							classes: tipClass + "itg-tooltip"
						},
						content: {
							text: itg.replaceQuotes($tooltipLink.data('tooltip-content'), false), /*.replace(/&/g, '&amp;')*/
							title: {
								text: $tooltipLink.text()
							}
						}
					};
				} else if ($tooltipLink.hasClass("itg-mediatip")) {
					// ### Mediatip
					itg.info('Do init a MEDIATIP');
					tooltipTypeSpecific = {
						style: {
							classes: tipClass + "itg-mediatip"
						},
						position: {
							adjust: {
								scroll: false
							}
						},
						content: {
							text: '',
							title: {
								text: $tooltipLink.text()
							}
						},
						events: {
							show: function show() {
								$tooltipLink.qtip().reposition();
							}
						}
					};
					if ($tooltipLink.data('mediatip-image')) {
						// #### Image
						var attrs = {
							src: $tooltipLink.data('mediatip-image'),
							alt: $tooltipLink.text()
						};
						if (typeof itg.qtip_filters !== 'undefined' && itg.qtip_filters && typeof itg.qtip_filters.mediatip !== 'undefined' && itg.qtip_filters.mediatip && itg.qtip_filters.mediatip.length > 0) {
							for (var i = 0; i < itg.qtip_filters.mediatip.length; i++) {
								attrs = extend(attrs, itg.qtip_filters.mediatip[i]($tooltipLink));
							}
						}
						var attrsStr = '';
						for (var key in attrs) {
							attrsStr += key + "=\"" + attrs[key] + "\" ";
						}
						tooltipTypeSpecific.content['text'] = "<img " + attrsStr + ">";
						var caption = $tooltipLink.data('mediatip-caption');
						if (caption) {
							tooltipTypeSpecific.content['text'] += "<div class=\"ithoughts_tt_gl-caption\">" + caption.replace(/&aquot;/g, '"') + "</div>";
						}
					} else if ($tooltipLink.data('mediatip-html')) {
						var text = $tooltipLink.data('mediatip-html'),
						    replacedText = function htmlEntitiesDecode() {
							return $('<textarea />').html(text).text();
						}().trim().replace(/&aquot;/g, '"'),
						    redimedInfos = function getRedimInfos(element) {
							if (1 === element.length && ('IFRAME' === element[0].nodeName && element[0].src.match(/youtube|dailymotion/) || 'VIDEO' === element[0].nodeName)) {
								return redimVid(element);
							} else {
								itg.warn('Not an IFRAME from youtube OR a VIDEO', element);
							}
						}($($.parseHTML(replacedText)));
						renderFcts.push(function pinableMediaTip(event, api) {
							// Grab the tooltip element from the API elements object
							// Notice the 'tooltip' prefix of the event name!
							api.elements.title.find(".itg_pin_container").click(function clickPinKeepOpen() {
								if ($(this).toggleClass('pined').hasClass('pined')) {
									api.disable();
								} else {
									api.enable();
								}
							});
						});
						// #### Iframe / HTML
						extend(true, tooltipTypeSpecific, {
							content: {
								text: redimedInfos['text'],
								title: {
									text: "<span class=\"itg_pin_container\"><svg viewBox=\"0 0 26 26\" class=\"itg_pin\"><use xlink:href=\"#icon-pin\"></use></svg></span><span class=\"ithoughts_tt_gl-title_with_pin\">" + tooltipTypeSpecific.content.title.text + "</span>"
								}
							},
							style: {
								width: redimedInfos['dims']['width']
							}
						});
						tooltipTypeSpecific.style.classes += ' ithoughts_tt_gl-force_no_pad ithoughts_tt_gl-video_tip ithoughts_tt_gl-with_pin';
					}
				} else {
					return;
				}

				// ## Override defaults
				if ('true' === $tooltipLink.data('tooltip-autoshow')) {
					extend(true, tooltipOverrides, {
						show: {
							ready: true
						}
					});
				}
				if ('true' === $tooltipLink.data('tooltip-nosolo')) {
					extend(true, tooltipOverrides, {
						show: {
							solo: false
						}
					});
				}
				if ('true' === $tooltipLink.data('tooltip-nohide')) {
					extend(true, tooltipOverrides, {
						hide: 'someevent',
						show: {
							event: 'someevent'
						}
					});
				}
				if ($tooltipLink.data('tooltip-id')) {
					extend(true, tooltipOverrides, {
						id: $tooltipLink.data('tooltip-id')
					});
				}
				if ($tooltipLink.data('qtip-keep-open') || $tooltipLink.hasClass("itg-mediatip")) {
					extend(true, tooltipOverrides, {
						hide: {
							fixed: true,
							delay: 250
						}
					});
				}
				if ('true' === $tooltipLink.data('tooltip-prerender')) {
					extend(true, tooltipOverrides, {
						prerender: true
					});
				}

				var tooltipOpts = extend(true, tooltipComon, tooltipTypeSpecific, tooltipOverrides, qTipEvents);

				$tooltipLink.qtip(tooltipOpts);

				//Remove title for tooltip, causing double tooltip
				$tooltipLink.find('a[title]').removeAttr('title');
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
	}, { "./comon": 1 }] }, {}, [2]);
//# sourceMappingURL=main.js.map
