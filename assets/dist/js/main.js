"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

		var _this = this;

		require('regenerator-runtime/runtime');

		var ithoughts = iThoughts.v5;
		var $ = ithoughts.$,
		    isNA = ithoughts.isNA;


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

		var sendAjaxQuery = function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action, data, nonce) {
				var loader;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								loader = ithoughts.makeLoader();
								return _context.abrupt("return", new Promise(function (resolve, reject) {
									var sendData = {
										action: "ithoughts_tt_gl_" + action
									};
									if (!isNA(nonce)) {
										sendData._wpnonce = nonce;
									}
									if (!isNA(data)) {
										sendData.data = data;
									}
									$.ajax({
										method: 'POST',
										async: true,
										url: iThoughtsTooltipGlossary.admin_ajax,
										//			dataType: 'json',
										data: sendData,
										success: function success(data) {
											loader.remove();
											return resolve(data);
										},
										error: function error(xhr) {
											loader.remove();
											return reject(xhr);
										}
									});
								}));

							case 2:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, _this);
			}));

			return function sendAjaxQuery(_x2, _x3, _x4) {
				return _ref.apply(this, arguments);
			};
		}();

		module.exports = {
			maybePrefixAttribute: maybePrefixAttribute,
			extractAttrs: extractAttrs,
			generateTakeAttr: generateTakeAttr,
			get: get,
			isTrueValue: isTrueValue,
			htmlEncode: htmlEncode,
			htmlDecode: htmlDecode,
			sendAjaxQuery: sendAjaxQuery
		};
	}, { "regenerator-runtime/runtime": 4 }], 2: [function (require, module, exports) {
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

		var linkEventHandlers = {
			click: function click(event) {
				var trigger = this.getAttribute('data-tip-trigger') || itg.qtiptrigger;
				if (trigger === 'responsive') {
					if (!linksExpanded.get(this) && linksTouch.get(this) !== 0) {
						linksExpanded.set(this, true);
						$(this).triggerHandler('responsive');
						event.preventDefault();
					}
				} else {
					if (linksTouch.get(this) !== 1) {
						event.preventDefault();
						linksTouch.set(this, 1);
					}
				}
			},
			touchstart: function touchstart() {
				linksTouch.set(this, 1);
			},
			touchend: function touchend() {
				linksTouch.set(this, 2);
			},
			focusin: function focusin() {
				$(this).triggerHandler('responsive');
			},
			focusout: function focusout() {
				$(this).triggerHandler('responsiveout');
				linksTouch.set(this, 0);
			}
		};
		itg.linkEventHandlers = linkEventHandlers;

		var doTipRender = function doTipRender(renderFcts, props, event, api) {
			var _this2 = this;

			$(this).css({
				maxWidth: props.maxWidth
			});
			$(this).prop('animation_duration', props.animDuration);
			renderFcts.forEach(function (renderFct) {
				return renderFct.call(_this2, event, api);
			});
			if (itg.renderHooks) {
				itg.renderHooks.forEach(function (hook) {
					return hook.call(_this2, event, api);
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
				$tooltipLink.click(linkEventHandlers.click).bind(evts.start, linkEventHandlers.touchstart).bind(evts.end, linkEventHandlers.touchend).bind('mouseover focus', linkEventHandlers.focusin).bind('mouseleave focusout', linkEventHandlers.focusout);

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
					var _this3 = this;

					return Object.keys(this.opts).map(function (key) {
						return OptArray.generateAttr(key, _this3.opts[key]);
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
	}, {}], 4: [function (require, module, exports) {
		(function (global) {
			/**
    * Copyright (c) 2014, Facebook, Inc.
    * All rights reserved.
    *
    * This source code is licensed under the BSD-style license found in the
    * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
    * additional grant of patent rights can be found in the PATENTS file in
    * the same directory.
    */

			!function (global) {
				"use strict";

				var Op = Object.prototype;
				var hasOwn = Op.hasOwnProperty;
				var undefined; // More compressible than void 0.
				var $Symbol = typeof Symbol === "function" ? Symbol : {};
				var iteratorSymbol = $Symbol.iterator || "@@iterator";
				var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
				var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

				var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
				var runtime = global.regeneratorRuntime;
				if (runtime) {
					if (inModule) {
						// If regeneratorRuntime is defined globally and we're in a module,
						// make the exports object identical to regeneratorRuntime.
						module.exports = runtime;
					}
					// Don't bother evaluating the rest of this file if the runtime was
					// already defined globally.
					return;
				}

				// Define the runtime globally (as expected by generated code) as either
				// module.exports (if we're in a module) or a new, empty object.
				runtime = global.regeneratorRuntime = inModule ? module.exports : {};

				function wrap(innerFn, outerFn, self, tryLocsList) {
					// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
					var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
					var generator = Object.create(protoGenerator.prototype);
					var context = new Context(tryLocsList || []);

					// The ._invoke method unifies the implementations of the .next,
					// .throw, and .return methods.
					generator._invoke = makeInvokeMethod(innerFn, self, context);

					return generator;
				}
				runtime.wrap = wrap;

				// Try/catch helper to minimize deoptimizations. Returns a completion
				// record like context.tryEntries[i].completion. This interface could
				// have been (and was previously) designed to take a closure to be
				// invoked without arguments, but in all the cases we care about we
				// already have an existing method we want to call, so there's no need
				// to create a new function object. We can even get away with assuming
				// the method takes exactly one argument, since that happens to be true
				// in every case, so we don't have to touch the arguments object. The
				// only additional allocation required is the completion record, which
				// has a stable shape and so hopefully should be cheap to allocate.
				function tryCatch(fn, obj, arg) {
					try {
						return { type: "normal", arg: fn.call(obj, arg) };
					} catch (err) {
						return { type: "throw", arg: err };
					}
				}

				var GenStateSuspendedStart = "suspendedStart";
				var GenStateSuspendedYield = "suspendedYield";
				var GenStateExecuting = "executing";
				var GenStateCompleted = "completed";

				// Returning this object from the innerFn has the same effect as
				// breaking out of the dispatch switch statement.
				var ContinueSentinel = {};

				// Dummy constructor functions that we use as the .constructor and
				// .constructor.prototype properties for functions that return Generator
				// objects. For full spec compliance, you may wish to configure your
				// minifier not to mangle the names of these two functions.
				function Generator() {}
				function GeneratorFunction() {}
				function GeneratorFunctionPrototype() {}

				// This is a polyfill for %IteratorPrototype% for environments that
				// don't natively support it.
				var IteratorPrototype = {};
				IteratorPrototype[iteratorSymbol] = function () {
					return this;
				};

				var getProto = Object.getPrototypeOf;
				var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
				if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
					// This environment has a native %IteratorPrototype%; use it instead
					// of the polyfill.
					IteratorPrototype = NativeIteratorPrototype;
				}

				var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
				GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
				GeneratorFunctionPrototype.constructor = GeneratorFunction;
				GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

				// Helper for defining the .next, .throw, and .return methods of the
				// Iterator interface in terms of a single ._invoke method.
				function defineIteratorMethods(prototype) {
					["next", "throw", "return"].forEach(function (method) {
						prototype[method] = function (arg) {
							return this._invoke(method, arg);
						};
					});
				}

				runtime.isGeneratorFunction = function (genFun) {
					var ctor = typeof genFun === "function" && genFun.constructor;
					return ctor ? ctor === GeneratorFunction ||
					// For the native GeneratorFunction constructor, the best we can
					// do is to check its .name property.
					(ctor.displayName || ctor.name) === "GeneratorFunction" : false;
				};

				runtime.mark = function (genFun) {
					if (Object.setPrototypeOf) {
						Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
					} else {
						genFun.__proto__ = GeneratorFunctionPrototype;
						if (!(toStringTagSymbol in genFun)) {
							genFun[toStringTagSymbol] = "GeneratorFunction";
						}
					}
					genFun.prototype = Object.create(Gp);
					return genFun;
				};

				// Within the body of any async function, `await x` is transformed to
				// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
				// `hasOwn.call(value, "__await")` to determine if the yielded value is
				// meant to be awaited.
				runtime.awrap = function (arg) {
					return { __await: arg };
				};

				function AsyncIterator(generator) {
					function invoke(method, arg, resolve, reject) {
						var record = tryCatch(generator[method], generator, arg);
						if (record.type === "throw") {
							reject(record.arg);
						} else {
							var result = record.arg;
							var value = result.value;
							if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
								return Promise.resolve(value.__await).then(function (value) {
									invoke("next", value, resolve, reject);
								}, function (err) {
									invoke("throw", err, resolve, reject);
								});
							}

							return Promise.resolve(value).then(function (unwrapped) {
								// When a yielded Promise is resolved, its final value becomes
								// the .value of the Promise<{value,done}> result for the
								// current iteration. If the Promise is rejected, however, the
								// result for this iteration will be rejected with the same
								// reason. Note that rejections of yielded Promises are not
								// thrown back into the generator function, as is the case
								// when an awaited Promise is rejected. This difference in
								// behavior between yield and await is important, because it
								// allows the consumer to decide what to do with the yielded
								// rejection (swallow it and continue, manually .throw it back
								// into the generator, abandon iteration, whatever). With
								// await, by contrast, there is no opportunity to examine the
								// rejection reason outside the generator function, so the
								// only option is to throw it from the await expression, and
								// let the generator function handle the exception.
								result.value = unwrapped;
								resolve(result);
							}, reject);
						}
					}

					if (_typeof(global.process) === "object" && global.process.domain) {
						invoke = global.process.domain.bind(invoke);
					}

					var previousPromise;

					function enqueue(method, arg) {
						function callInvokeWithMethodAndArg() {
							return new Promise(function (resolve, reject) {
								invoke(method, arg, resolve, reject);
							});
						}

						return previousPromise =
						// If enqueue has been called before, then we want to wait until
						// all previous Promises have been resolved before calling invoke,
						// so that results are always delivered in the correct order. If
						// enqueue has not been called before, then it is important to
						// call invoke immediately, without waiting on a callback to fire,
						// so that the async generator function has the opportunity to do
						// any necessary setup in a predictable way. This predictability
						// is why the Promise constructor synchronously invokes its
						// executor callback, and why async functions synchronously
						// execute code before the first await. Since we implement simple
						// async functions in terms of async generators, it is especially
						// important to get this right, even though it requires care.
						previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
						// Avoid propagating failures to Promises returned by later
						// invocations of the iterator.
						callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
					}

					// Define the unified helper method that is used to implement .next,
					// .throw, and .return (see defineIteratorMethods).
					this._invoke = enqueue;
				}

				defineIteratorMethods(AsyncIterator.prototype);
				AsyncIterator.prototype[asyncIteratorSymbol] = function () {
					return this;
				};
				runtime.AsyncIterator = AsyncIterator;

				// Note that simple async functions are implemented on top of
				// AsyncIterator objects; they just return a Promise for the value of
				// the final result produced by the iterator.
				runtime.async = function (innerFn, outerFn, self, tryLocsList) {
					var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

					return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
					: iter.next().then(function (result) {
						return result.done ? result.value : iter.next();
					});
				};

				function makeInvokeMethod(innerFn, self, context) {
					var state = GenStateSuspendedStart;

					return function invoke(method, arg) {
						if (state === GenStateExecuting) {
							throw new Error("Generator is already running");
						}

						if (state === GenStateCompleted) {
							if (method === "throw") {
								throw arg;
							}

							// Be forgiving, per 25.3.3.3.3 of the spec:
							// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
							return doneResult();
						}

						context.method = method;
						context.arg = arg;

						while (true) {
							var delegate = context.delegate;
							if (delegate) {
								var delegateResult = maybeInvokeDelegate(delegate, context);
								if (delegateResult) {
									if (delegateResult === ContinueSentinel) continue;
									return delegateResult;
								}
							}

							if (context.method === "next") {
								// Setting context._sent for legacy support of Babel's
								// function.sent implementation.
								context.sent = context._sent = context.arg;
							} else if (context.method === "throw") {
								if (state === GenStateSuspendedStart) {
									state = GenStateCompleted;
									throw context.arg;
								}

								context.dispatchException(context.arg);
							} else if (context.method === "return") {
								context.abrupt("return", context.arg);
							}

							state = GenStateExecuting;

							var record = tryCatch(innerFn, self, context);
							if (record.type === "normal") {
								// If an exception is thrown from innerFn, we leave state ===
								// GenStateExecuting and loop back for another invocation.
								state = context.done ? GenStateCompleted : GenStateSuspendedYield;

								if (record.arg === ContinueSentinel) {
									continue;
								}

								return {
									value: record.arg,
									done: context.done
								};
							} else if (record.type === "throw") {
								state = GenStateCompleted;
								// Dispatch the exception by looping back around to the
								// context.dispatchException(context.arg) call above.
								context.method = "throw";
								context.arg = record.arg;
							}
						}
					};
				}

				// Call delegate.iterator[context.method](context.arg) and handle the
				// result, either by returning a { value, done } result from the
				// delegate iterator, or by modifying context.method and context.arg,
				// setting context.delegate to null, and returning the ContinueSentinel.
				function maybeInvokeDelegate(delegate, context) {
					var method = delegate.iterator[context.method];
					if (method === undefined) {
						// A .throw or .return when the delegate iterator has no .throw
						// method always terminates the yield* loop.
						context.delegate = null;

						if (context.method === "throw") {
							if (delegate.iterator.return) {
								// If the delegate iterator has a return method, give it a
								// chance to clean up.
								context.method = "return";
								context.arg = undefined;
								maybeInvokeDelegate(delegate, context);

								if (context.method === "throw") {
									// If maybeInvokeDelegate(context) changed context.method from
									// "return" to "throw", let that override the TypeError below.
									return ContinueSentinel;
								}
							}

							context.method = "throw";
							context.arg = new TypeError("The iterator does not provide a 'throw' method");
						}

						return ContinueSentinel;
					}

					var record = tryCatch(method, delegate.iterator, context.arg);

					if (record.type === "throw") {
						context.method = "throw";
						context.arg = record.arg;
						context.delegate = null;
						return ContinueSentinel;
					}

					var info = record.arg;

					if (!info) {
						context.method = "throw";
						context.arg = new TypeError("iterator result is not an object");
						context.delegate = null;
						return ContinueSentinel;
					}

					if (info.done) {
						// Assign the result of the finished delegate to the temporary
						// variable specified by delegate.resultName (see delegateYield).
						context[delegate.resultName] = info.value;

						// Resume execution at the desired location (see delegateYield).
						context.next = delegate.nextLoc;

						// If context.method was "throw" but the delegate handled the
						// exception, let the outer generator proceed normally. If
						// context.method was "next", forget context.arg since it has been
						// "consumed" by the delegate iterator. If context.method was
						// "return", allow the original .return call to continue in the
						// outer generator.
						if (context.method !== "return") {
							context.method = "next";
							context.arg = undefined;
						}
					} else {
						// Re-yield the result returned by the delegate method.
						return info;
					}

					// The delegate iterator is finished, so forget it and continue with
					// the outer generator.
					context.delegate = null;
					return ContinueSentinel;
				}

				// Define Generator.prototype.{next,throw,return} in terms of the
				// unified ._invoke helper method.
				defineIteratorMethods(Gp);

				Gp[toStringTagSymbol] = "Generator";

				// A Generator should always return itself as the iterator object when the
				// @@iterator function is called on it. Some browsers' implementations of the
				// iterator prototype chain incorrectly implement this, causing the Generator
				// object to not be returned from this call. This ensures that doesn't happen.
				// See https://github.com/facebook/regenerator/issues/274 for more details.
				Gp[iteratorSymbol] = function () {
					return this;
				};

				Gp.toString = function () {
					return "[object Generator]";
				};

				function pushTryEntry(locs) {
					var entry = { tryLoc: locs[0] };

					if (1 in locs) {
						entry.catchLoc = locs[1];
					}

					if (2 in locs) {
						entry.finallyLoc = locs[2];
						entry.afterLoc = locs[3];
					}

					this.tryEntries.push(entry);
				}

				function resetTryEntry(entry) {
					var record = entry.completion || {};
					record.type = "normal";
					delete record.arg;
					entry.completion = record;
				}

				function Context(tryLocsList) {
					// The root entry object (effectively a try statement without a catch
					// or a finally block) gives us a place to store values thrown from
					// locations where there is no enclosing try statement.
					this.tryEntries = [{ tryLoc: "root" }];
					tryLocsList.forEach(pushTryEntry, this);
					this.reset(true);
				}

				runtime.keys = function (object) {
					var keys = [];
					for (var key in object) {
						keys.push(key);
					}
					keys.reverse();

					// Rather than returning an object with a next method, we keep
					// things simple and return the next function itself.
					return function next() {
						while (keys.length) {
							var key = keys.pop();
							if (key in object) {
								next.value = key;
								next.done = false;
								return next;
							}
						}

						// To avoid creating an additional object, we just hang the .value
						// and .done properties off the next function object itself. This
						// also ensures that the minifier will not anonymize the function.
						next.done = true;
						return next;
					};
				};

				function values(iterable) {
					if (iterable) {
						var iteratorMethod = iterable[iteratorSymbol];
						if (iteratorMethod) {
							return iteratorMethod.call(iterable);
						}

						if (typeof iterable.next === "function") {
							return iterable;
						}

						if (!isNaN(iterable.length)) {
							var i = -1,
							    next = function next() {
								while (++i < iterable.length) {
									if (hasOwn.call(iterable, i)) {
										next.value = iterable[i];
										next.done = false;
										return next;
									}
								}

								next.value = undefined;
								next.done = true;

								return next;
							};

							return next.next = next;
						}
					}

					// Return an iterator with no values.
					return { next: doneResult };
				}
				runtime.values = values;

				function doneResult() {
					return { value: undefined, done: true };
				}

				Context.prototype = {
					constructor: Context,

					reset: function reset(skipTempReset) {
						this.prev = 0;
						this.next = 0;
						// Resetting context._sent for legacy support of Babel's
						// function.sent implementation.
						this.sent = this._sent = undefined;
						this.done = false;
						this.delegate = null;

						this.method = "next";
						this.arg = undefined;

						this.tryEntries.forEach(resetTryEntry);

						if (!skipTempReset) {
							for (var name in this) {
								// Not sure about the optimal order of these conditions:
								if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
									this[name] = undefined;
								}
							}
						}
					},

					stop: function stop() {
						this.done = true;

						var rootEntry = this.tryEntries[0];
						var rootRecord = rootEntry.completion;
						if (rootRecord.type === "throw") {
							throw rootRecord.arg;
						}

						return this.rval;
					},

					dispatchException: function dispatchException(exception) {
						if (this.done) {
							throw exception;
						}

						var context = this;
						function handle(loc, caught) {
							record.type = "throw";
							record.arg = exception;
							context.next = loc;

							if (caught) {
								// If the dispatched exception was caught by a catch block,
								// then let that catch block handle the exception normally.
								context.method = "next";
								context.arg = undefined;
							}

							return !!caught;
						}

						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							var record = entry.completion;

							if (entry.tryLoc === "root") {
								// Exception thrown outside of any try block that could handle
								// it, so set the completion value of the entire function to
								// throw the exception.
								return handle("end");
							}

							if (entry.tryLoc <= this.prev) {
								var hasCatch = hasOwn.call(entry, "catchLoc");
								var hasFinally = hasOwn.call(entry, "finallyLoc");

								if (hasCatch && hasFinally) {
									if (this.prev < entry.catchLoc) {
										return handle(entry.catchLoc, true);
									} else if (this.prev < entry.finallyLoc) {
										return handle(entry.finallyLoc);
									}
								} else if (hasCatch) {
									if (this.prev < entry.catchLoc) {
										return handle(entry.catchLoc, true);
									}
								} else if (hasFinally) {
									if (this.prev < entry.finallyLoc) {
										return handle(entry.finallyLoc);
									}
								} else {
									throw new Error("try statement without catch or finally");
								}
							}
						}
					},

					abrupt: function abrupt(type, arg) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
								var finallyEntry = entry;
								break;
							}
						}

						if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
							// Ignore the finally entry if control is not jumping to a
							// location outside the try/catch block.
							finallyEntry = null;
						}

						var record = finallyEntry ? finallyEntry.completion : {};
						record.type = type;
						record.arg = arg;

						if (finallyEntry) {
							this.method = "next";
							this.next = finallyEntry.finallyLoc;
							return ContinueSentinel;
						}

						return this.complete(record);
					},

					complete: function complete(record, afterLoc) {
						if (record.type === "throw") {
							throw record.arg;
						}

						if (record.type === "break" || record.type === "continue") {
							this.next = record.arg;
						} else if (record.type === "return") {
							this.rval = this.arg = record.arg;
							this.method = "return";
							this.next = "end";
						} else if (record.type === "normal" && afterLoc) {
							this.next = afterLoc;
						}

						return ContinueSentinel;
					},

					finish: function finish(finallyLoc) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.finallyLoc === finallyLoc) {
								this.complete(entry.completion, entry.afterLoc);
								resetTryEntry(entry);
								return ContinueSentinel;
							}
						}
					},

					"catch": function _catch(tryLoc) {
						for (var i = this.tryEntries.length - 1; i >= 0; --i) {
							var entry = this.tryEntries[i];
							if (entry.tryLoc === tryLoc) {
								var record = entry.completion;
								if (record.type === "throw") {
									var thrown = record.arg;
									resetTryEntry(entry);
								}
								return thrown;
							}
						}

						// The context.catch method must only be called with a location
						// argument that corresponds to a known catch block.
						throw new Error("illegal catch attempt");
					},

					delegateYield: function delegateYield(iterable, resultName, nextLoc) {
						this.delegate = {
							iterator: values(iterable),
							resultName: resultName,
							nextLoc: nextLoc
						};

						if (this.method === "next") {
							// Deliberately forget the last sent value so that we don't
							// accidentally pass it on to the delegate.
							this.arg = undefined;
						}

						return ContinueSentinel;
					}
				};
			}(
			// Among the various tricks for obtaining a reference to the global
			// object, this seems to be the most reliable technique that does not
			// use indirect eval (which violates Content Security Policy).
			(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : this);
		}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	}, {}] }, {}, [2]);
//# sourceMappingURL=main.js.map
