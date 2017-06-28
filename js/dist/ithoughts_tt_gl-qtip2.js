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

(function selfCalling(ithoughts) {

	var tooltipsContainer,
	    $ = ithoughts.$,
	    $w = ithoughts.$w,
	    $d = ithoughts.$d,
	    itg = iThoughtsTooltipGlossary,
	    isNA = ithoughts.isNA,
	    redimWait,
	    extend = $.extend,
	    prefix1 = 'itg',
	    types = ['glossary', 'tooltip', 'mediatip'];

	ithoughts.initLoggers(itg, 'iThoughts Tooltip Glossary', itg.verbosity);

	/**
  * @function stripQuotes
  * @description Encode or decode string with pseudo-html encoded quote
  * @memberof ithoughts_tooltip_glossary
  * @param {string} string String to encode or decode
  * @param {boolean} encode True to encode, false to decode
  * @returns {string} Encoded or decoded string
  * @author Gerkin
  */
	itg.stripQuotes = function stripQuotes(string, encode) {
		if (typeof string != 'string') {
			return '';
		}
		if (encode) {
			return string /*.replace(/&/g, '&amp;')*/.replace(/"/g, '&aquot;').replace(/\n/g, '<br/>');
		} else {
			return string.replace(/<br\/>/g, '\n').replace(/&aquot;/g, '"') /*.replace(/&amp;/g, '&')*/;
		}
	};

	/**
  * @function doInitTooltips
  * @description Init all tooltips
  * @returns {undefined}
  * @author Gerkin
  */
	itg.doInitTooltips = function doInitTooltips() {
		//Create container
		if (isNA(tooltipsContainer) && 0 === (tooltipsContainer = $('#' + prefix1 + '-tipsContainer')).length) {
			tooltipsContainer = $($.parseHTML('<div id="' + prefix1 + '-tipsContainer" class="' + prefix1 + '-tipsContainer"></div>'));
			$(document.body).append(tooltipsContainer);
		}
		var evts = {
			start: ithoughts.isIos ? 'mousedown' : 'touchstart',
			end: ithoughts.isIos ? 'mouseup' : 'touchend'
		};
		if (ithoughts.isIos) {
			$('body').css({
				cursor: 'pointer'
			});
		}

		var $tooltipSpans = $(types.map(function typesToSelectorMap(v) {
			return 'span.' + prefix1 + '-' + v;
		}).join(','));
		itg.log('Having following elements to init tooltpis on: ', $tooltipSpans);
		$tooltipSpans.each(function doInitTooltip() {
			// ## Init tooltip
			var $tooltipSpan = $(this),

			/* Use provided data or use the default settings */
			qtipstyle = $tooltipSpan.data('qtipstyle') || itg.qtipstyle,
			    termcontent = $tooltipSpan.data('termcontent') || itg.termcontent,
			    qtipshadow = $tooltipSpan.data('qtipshadown') || itg.qtipshadown,
			    qtiprounded = $tooltipSpan.data('qtiprounded') || itg.qtiprounded,
			    qtiptrigger = $tooltipSpan.data('qtiptrigger') || itg.qtiptrigger,
			    animIn = $tooltipSpan.data('animation_in') || itg.anims.in,
			    animOut = $tooltipSpan.data('animation_out') || itg.anims.out,
			    renderFcts = [],
			    animDuration = $tooltipSpan.data('animation_time') || itg.anims.duration;
			qtipshadow = 'true' === qtipshadow || '1' === qtipshadow;
			qtiprounded = 'true' === qtiprounded || '1' === qtiprounded;

			// If set to click, disable glossary link and wrap it in 2 step link
			if ('click' === qtiptrigger) {
				$tooltipSpan.children('a').click(function clickSpanSetTouch(e) {
					if ($tooltipSpan.touch !== 1) {
						e.preventDefault();
						$tooltipSpan.touch = 1;
					}
				}).mouseleave(function leaveSpanUnsetTouch() {
					$tooltipSpan.touch = 0;
				});
			} else if ('responsive' === qtiptrigger) {
				$tooltipSpan.touch = ithoughts.baseTouch;
				//Detect touch/click out
				$('body').bind('click touch', function bodyClickEmitResponsiveOut(event) {
					if (0 === $(event.target).closest($tooltipSpan).length) {
						$tooltipSpan.data('expanded', false);
						$tooltipSpan.triggerHandler('responsiveout');
					}
				});
				$tooltipSpan.children('a').click(function doExpandTouched(e) {
					if (!$tooltipSpan.data('expanded') && $tooltipSpan.touch !== 0) {
						$tooltipSpan.data('expanded', true);
						$tooltipSpan.triggerHandler('responsive');
						e.preventDefault();
					}
				}).bind(evts.start, function eventStartTouch() {
					$tooltipSpan.touch = 1;
				}).bind(evts.end, function eventEndTouch() {
					$tooltipSpan.touch = 2;
				});
			}
			$tooltipSpan.bind('mouseover focus', function emitResponsive() {
				$tooltipSpan.triggerHandler('responsive');
			}).bind('mouseleave focusout', function emitResponsiveOut() {
				$tooltipSpan.triggerHandler('responsiveout');
			});

			var tipClass;
			if ($tooltipSpan.data('qtipstyle')) {
				tipClass = 'qtip-' + $tooltipSpan.data('qtipstyle') + (qtipshadow ? ' qtip-shadow' : '') + (qtiprounded ? ' qtip-rounded' : '') + ' ';
			} else if ($tooltipSpan.data('tooltip-classes')) {
				tipClass = $tooltipSpan.data('tooltip-classes');
			} else {
				tipClass = 'qtip-' + qtipstyle + (qtipshadow ? ' qtip-shadow' : '') + (qtiprounded ? ' qtip-rounded' : '') + ' ';
			}
			var tooltipComon,
			    tooltipTypeSpecific,
			    tooltipOverrides = {};

			// ## Global option
			tooltipComon = {
				prerender: false,
				suppress: false,
				position: {
					at: $tooltipSpan.data('position-at') || 'top center', // Position the tooltip above the link
					my: $tooltipSpan.data('position-my') || 'bottom center',
					viewport: $('body'), // Keep the tooltip on-screen at all times
					effect: false, // Disable positioning animation
					container: tooltipsContainer
				},
				show: {
					event: qtiptrigger,
					solo: true, // Only show one tooltip at a time
					effect: itg.animationFunctions.in[animIn] || itg.animationFunctions.in.none
				},
				//hide: 'unfocus',
				hide: {
					event: /*'noevent',*/'responsive' === qtiptrigger ? 'responsiveout' : 'mouseleave',
					leave: false,
					effect: itg.animationFunctions.out[animOut] || itg.animationFunctions.in.none
				},
				events: {
					render: function render(event, api) {
						// $tooltipSpan refers to the span
						$(this).css({
							maxWidth: $tooltipSpan.data('tooltip-maxwidth')
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
			if ($tooltipSpan.hasClass(prefix1 + '-glossary')) {
				// ### Glossary tips
				itg.info('Do init a GLOSSARYTIP');
				if ($tooltipSpan.data('termid') && termcontent !== 'off') {
					// Define the `ajaxPostData` that will be used bellow to send the request to the API
					var ajaxPostData = {
						action: 'ithoughts_tt_gl_get_term_details',
						content: termcontent,
						termid: $tooltipSpan.data()['termid']
					};
					// If WPML is installed, the tooltip editor allow the user to check the *disable auto translation* option, and this option should be used when querying the API
					if ('true' === $tooltipSpan.data('disable_auto_translation')) {
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
								type: 'POST',
								// `ajaxPostData` was defined [above](#)
								data: ajaxPostData,
								dataType: 'json',
								loading: false,
								// Display the received content on success, or `Error`
								success: function success(resp) {
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
							classes: tipClass + prefix1 + '-glossary'
						}
					};
				} else if ($tooltipSpan.data('term-content') && $tooltipSpan.data('term-title')) {
					// #### Static term
					tooltipTypeSpecific = {
						content: {
							title: {
								text: $tooltipSpan.data('term-title')
							},
							text: $tooltipSpan.data('term-content')
						},
						style: {
							classes: tipClass + prefix1 + '-glossary'
						}
					};
				}
			} else if ($tooltipSpan.hasClass(prefix1 + '-tooltip')) {
				// ### Tooltip
				itg.info('Do init a TOOLTIP');
				tooltipTypeSpecific = {
					style: {
						classes: tipClass + prefix1 + '-tooltip'
					},
					content: {
						text: itg.stripQuotes($tooltipSpan.data('tooltip-content'), false), /*.replace(/&/g, '&amp;')*/
						title: {
							text: $tooltipSpan.text()
						}
					}
				};
			} else if ($tooltipSpan.hasClass(prefix1 + '-mediatip')) {
				// ### Mediatip
				itg.info('Do init a MEDIATIP');
				tooltipTypeSpecific = {
					style: {
						classes: tipClass + prefix1 + '-mediatip'
					},
					position: {
						adjust: {
							scroll: false
						}
					},
					content: {
						text: '',
						title: {
							text: $tooltipSpan.text()
						}
					},
					events: {
						show: function show() {
							$tooltipSpan.qtip().reposition();
						}
					}
				};
				if ($tooltipSpan.data('mediatip-image')) {
					// #### Image
					var attrs = {
						src: $tooltipSpan.data('mediatip-image'),
						alt: $tooltipSpan.text()
					};
					if (typeof itg.qtip_filters !== 'undefined' && itg.qtip_filters && typeof itg.qtip_filters.mediatip !== 'undefined' && itg.qtip_filters.mediatip && itg.qtip_filters.mediatip.length > 0) {
						for (var i = 0; i < itg.qtip_filters.mediatip.length; i++) {
							attrs = extend(attrs, itg.qtip_filters.mediatip[i]($tooltipSpan));
						}
					}
					var attrsStr = '';
					for (var key in attrs) {
						attrsStr += key + '="' + attrs[key] + '" ';
					}
					tooltipTypeSpecific.content['text'] = '<img ' + attrsStr + '>';
					var caption = $tooltipSpan.data('mediatip-caption');
					if (caption) {
						tooltipTypeSpecific.content['text'] += '<div class="ithoughts_tt_gl-caption">' + caption.replace(/&aquot;/g, '"') + '</div>';
					}
				} else if ($tooltipSpan.data('mediatip-html')) {
					var text = $tooltipSpan.data('mediatip-html'),
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
						api.elements.title.find('.' + prefix1 + '_pin_container').click(function clickPinKeepOpen() {
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
								text: '<span class="' + prefix1 + '_pin_container"><svg viewBox="0 0 26 26" class="' + prefix1 + '_pin"><use xlink:href="#icon-pin"></use></svg></span><span class="ithoughts_tt_gl-title_with_pin">' + tooltipTypeSpecific.content.title.text + '</span>'
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
			if ('true' === $tooltipSpan.data('tooltip-autoshow')) {
				extend(true, tooltipOverrides, {
					show: {
						ready: true
					}
				});
			}
			if ('true' === $tooltipSpan.data('tooltip-nosolo')) {
				extend(true, tooltipOverrides, {
					show: {
						solo: false
					}
				});
			}
			if ('true' === $tooltipSpan.data('tooltip-nohide')) {
				extend(true, tooltipOverrides, {
					hide: 'someevent',
					show: {
						event: 'someevent'
					}
				});
			}
			if ($tooltipSpan.data('tooltip-id')) {
				extend(true, tooltipOverrides, {
					id: $tooltipSpan.data('tooltip-id')
				});
			}
			if ($tooltipSpan.data('qtip-keep-open') || $tooltipSpan.hasClass(prefix1 + '-mediatip')) {
				extend(true, tooltipOverrides, {
					hide: {
						fixed: true,
						delay: 250
					}
				});
			}
			if ('true' === $tooltipSpan.data('tooltip-prerender')) {
				extend(true, tooltipOverrides, {
					prerender: true
				});
			}

			var tooltipOpts = extend(true, tooltipComon, tooltipTypeSpecific, tooltipOverrides);

			$tooltipSpan.qtip(tooltipOpts);

			//Remove title for tooltip, causing double tooltip
			$tooltipSpan.find('a[title]').removeAttr('title');
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
						var advance = 'scale(' + scale + ')',
						    origin = $tip.css(['left', 'top']);
						origin = origin.left + ' ' + origin.top + ' 0';
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
						var advance = 'scale(' + scale + ')',
						    origin = $tip.css(['left', 'top']);
						origin = origin.left + ' ' + origin.top + ' 0';
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
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-qtip2.js.map
