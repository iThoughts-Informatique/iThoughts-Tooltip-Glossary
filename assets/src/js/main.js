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

const comon = require('./comon');
const OptArray = require('./optarray');

const ithoughts = iThoughts.v5;
const itg       = iThoughtsTooltipGlossary;

const { $, $w, $d, isNA } = ithoughts;
const extend = $.extend;

const $tooltipsContainer = $( $.parseHTML( `<div id="itg-tipsContainer" class="itg-tipsContainer"></div>` ));
$( document.body ).append( $tooltipsContainer );
const types = [
	'glossary',
	'tooltip',
	'mediatip',
];

let redimWait;

ithoughts.initLoggers( itg, 'iThoughts Tooltip Glossary', itg.verbosity );

/**
	 * @function replaceQuotes
	 * @description Encode or decode string with pseudo-html encoded quote
	 * @memberof ithoughts_tooltip_glossary
	 * @param {string} string String to encode or decode
	 * @param {boolean} encode True to encode, false to decode
	 * @returns {string} Encoded or decoded string
	 * @author Gerkin
	 */
itg.replaceQuotes = ( string, encode ) => {
	if ( typeof string != 'string' ) {
		return '';
	}
	if ( encode ) {
		return string.replace( /"/g, '&aquot;' ).replace( /\n/g, '<br/>' );
	} else {
		return string.replace( /<br\/>/g, '\n' ).replace( /&aquot;/g, '"' );
	}
};

const linksTouch = new WeakMap();
const linksExpanded = new WeakMap();
$( 'body' ).bind( 'click touch', event => {
	linksTouch.forEach(link => {
		const $link = $(link);
		if ( 0 === $( event.target ).closest( $link ).length ) {
			linksExpanded.set( link, false );
			$link.triggerHandler( 'responsiveout' );
		}
	});
});

const qTipEventHandlers = {
	click: {
		in(event){
			if ( linksTouch.get(this) !== 1 ) {
				event.preventDefault();
				linksTouch.set(this, 1);
			}
		},
		out(event){
			linksTouch.set(this, 0);
		}
	},
	responsive: {
		tap(event){
			if ( !linksExpanded.get( this ) && linksTouch.get(this) !== 0 ) {
				linksExpanded.set( this, true );
				$(this).triggerHandler( 'responsive' );
				event.preventDefault();
			}
		},
		touchstart(){
			linksTouch.set(this, 1);
		},
		touchend(){
			linksTouch.set(this, 2);
		},
		mousein(){
			$(this).triggerHandler( 'responsive' );
		},
		mouseout(){
			$(this).triggerHandler( 'responsiveout' );
		}
	},
};


const doTipRender = function doTipRender(props, event, api ) {
	console.log(this, arguments);
	$( this ).css({
		maxWidth: props.maxWidth,
	});
	$( this ).prop( 'animation_duration', props.animDuration );
	renderFcts.forEach(renderFct =>renderFct.call(this, event, api ));
	if ( itg.renderHooks ) {
		itg.renderHooks.forEach(hook =>hook.call(this, event, api ));
	}
};

const defaultComonTipOptions = {
	prerender: false,
	suppress:  false,
	position:  {
		viewport:  $( 'body' ),       // Keep the tooltip on-screen at all times
		effect:    false,           // Disable positioning animation
		container: $tooltipsContainer,
	},
	show: {
		solo:   true, // Only show one tooltip at a time
	},
	hide: {
		leave:  false,
	},
};

/**
 * @function doInitTooltips
 * @description Init all tooltips
 * @returns {undefined}
 * @author Gerkin
 */
itg.doInitTooltips = () => {
	const evts = {
		start: ithoughts.isIos ? 'mousedown' : 'touchstart',
		end:   ithoughts.isIos ? 'mouseup' : 'touchend',
	};
	if ( ithoughts.isIos )			{
		$( 'body' ).css({
			cursor: 'pointer',
		});
	}

	// Get all tooltips spans
	const $tooltipLinks = $( types.map( type => `a.itg-${ type }`).join( ',' ));
	itg.log( 'Having following elements to init tooltpis on: ', $tooltipLinks );

	$tooltipLinks.each( (index, tooltipLink) => {
		const takeAttr = comon.generateTakeAttr(tooltipLink);
		// ## Init tooltip
		const $tooltipLink = $( tooltipLink );

		const qTipConfigComponents = [];

		/* Use provided data or use the default settings */
		const qtiptrigger = takeAttr( 'qtiptrigger', itg.qtiptrigger);
		qTipConfigComponents.push({
			show: { event:  qtiptrigger },
			hide: { event:  ( 'responsive' === qtiptrigger ) ? 'responsiveout' : 'mouseleave' },
		});
		if ( 'click' === qtiptrigger ) {
			$tooltipLink
				.click( qTipEventHandlers.click.in )
				.mouseleave( qTipEventHandlers.click.out );
		} else if ( 'responsive' === qtiptrigger ) {
			linksTouch.set(tooltipLink, ithoughts.baseTouch);
			//Detect touch/click out
			$tooltipLink
				.click( qTipEventHandlers.responsive.tap )
				.bind( evts.start, qTipEventHandlers.responsive.touchstart )
				.bind( evts.end, qTipEventHandlers.responsive.touchend )
				.bind( 'mouseover focus', qTipEventHandlers.responsive.mousein )
				.bind( 'mouseleave focusout', qTipEventHandlers.responsive.mouseout );
		}


		qTipConfigComponents.push({
			show: {
				effect: comon.get(itg.animationFunctions.in, [takeAttr('animation_in', 'none')], itg.animationFunctions.in.none),
			},
			hide: {
				effect: comon.get(itg.animationFunctions.out, [takeAttr('animation_out', 'none')], itg.animationFunctions.in.none),
			},
		});



		const tipStyle = takeAttr('tip-style', itg.qtipstyle);
		const classes = takeAttr('tip-classes', '');
		const tipShadow = takeAttr('tip-shadow', itg.qtipshadow);
		const tipRounded = takeAttr('tip-rounded', itg.qtiprounded);
		const tipClasses = classes.split(/\s+/).concat([
			`qtip-${ tipStyle }`,
			tipShadow ? 'qtip-shadow' : false,
			tipRounded ? ' qtip-rounded' : false,
		]).join(' ');
		qTipConfigComponents.push({ style: { classes: tipClasses }});



		const title = takeAttr('title', tooltipLink.textContent);
		qTipConfigComponents.push({
			position:  {
				at: takeAttr( 'position-at', 'top center'), // Position the tooltip above the link
				my: takeAttr( 'position-my', 'bottom center'),// The tip corner goes down
			},
			content: {
				// Before doing API call, define the content with `Please wait` texts
				title: {
					text: title,
				},
			},
			events: {
				render: doTipRender.bind(null, {
					maxWidth: takeAttr('tip-maxwidth'),
					animDuration: takeAttr('anim-duration', itg.anims.duration),
				}),
			},
		});

		if ( $tooltipLink.hasClass( 'itg-glossary' )) {
			// ### Glossary tips
			itg.info( 'Do init a GLOSSARYTIP' );
			qTipConfigComponents.push({ style: { classes: `${ tipClasses } itg-glossary` }});
			const contenttype = takeAttr('glossary-contenttype', itg.contenttype);
			if(contenttype !== 'off'){
				const glossaryId = takeAttr('glossary-id');
				const glossaryContent = takeAttr('glossary-content');
				if (!isNA(glossaryId) ) {
					// Define the `ajaxPostData` that will be used bellow to send the request to the API
					const ajaxPostData = {
						action:      'ithoughts_tt_gl_get_term_details',
						content:     contenttype,
						glossaryId:  glossaryId,
						_ajax_nonce: itg.nonce,
					};
					// If WPML is installed, the tooltip editor allow the user to check the *disable auto translation* option, and this option should be used when querying the API
					if ( 'true' === takeAttr( 'disable_auto_translation' )){
						ajaxPostData['disable_auto_translation'] = true;
					}
					// #### Load via Ajax
					qTipConfigComponents.push({ content: {
						text: itg.lang.qtip.pleasewait_ajaxload.content,
						ajax: {
							// Use the [admin_ajax](http://www.google.com) endpoint provided by wordpress
							url:     itg.admin_ajax,
							type:    'GET',
							// `ajaxPostData` was defined [above](#)
							data:    ajaxPostData,
							loading: false,
							// Display the received content on success, or `Error`
							success: function success( resp ) {
								if ( resp.data && resp.data.refresh_nonce ) {
									itg.nonce = resp.data.refresh_nonce;
								}
								if ( resp.success ) {
									this.set( 'content.title', resp.data.title );
									this.set( 'content.text',  resp.data.content );
								} else {
									this.set( 'content.text', 'Error' );
								}
							},
						},
					}});
				} else if ( !isNA(glossaryContent)) {
					// #### Static term
					qTipConfigComponents.push({ content: { text: glossaryContent }});
				}
			}
		} else if ( $tooltipLink.hasClass( `itg-tooltip` )) {
			// ### Tooltip
			itg.info( 'Do init a TOOLTIP' );
			qTipConfigComponents.push({
				style: {
					classes: `${ tipClasses } itg-tooltip`,
				},
				content: {
					text:  itg.replaceQuotes( takeAttr( 'tooltip-content', '' ), false ), /*.replace(/&/g, '&amp;')*/
				},
			});
		} else if ( $tooltipLink.hasClass( `itg-mediatip` )) {
			// ### Mediatip
			itg.info( 'Do init a MEDIATIP' );
			qTipConfigComponents.push({
				style: {
					classes: `${ tipClasses }itg-mediatip`,
				},
				position: {
					adjust: {
						scroll: false,
					},
				},
				events: {
					show: function show() {
						$tooltipLink.qtip().reposition();
					},
				},
			});

			const type = takeAttr('mediatip-type', false);
			const source = takeAttr('mediatip-source');

			const caption = takeAttr('mediatip-caption', '');
			
			let content;
			if ( caption ) {
				content = `<div class="ithoughts_tt_gl-caption">${ itg.replaceQuotes(caption, false) }</div>`;
			}
			
			switch(type){
				case 'localimage':{
					// #### Image
					const attrs = new OptArray({
						src: source,
						alt: title,
					});
					const filters = comon.get(itg, ['qtip_filters', 'mediatip'], []);
					filters.forEach(filter => {
						extend( attrs.opts, filter.call( attrs.opts ));
					});

					content = `<img ${ attrs.toString() }>${content}`;
				} break;
			}
			if ( $tooltipLink.data( 'mediatip-image' )) {
			} else if ( $tooltipLink.data( 'mediatip-html' )) {
				const replacedText = itg.replaceQuotes(comon.htmlDecode(text).trim(), false);
				var text = $tooltipLink.data( 'mediatip-html' ),
					redimedInfos = ( function getRedimInfos( element ) {
						if ( 1 === element.length && (( 'IFRAME' === element[0].nodeName && element[0].src.match( /youtube|dailymotion/ )) || 'VIDEO' === element[0].nodeName )) {
							return redimVid( element );
						} else {
							itg.warn( 'Not an IFRAME from youtube OR a VIDEO', element );
						}
					})( $( $.parseHTML( replacedText )));
				renderFcts.push( ( event, api ) => {
					// Grab the tooltip element from the API elements object
					// Notice the 'tooltip' prefix of the event name!
					api.elements.title.find( `.itg_pin_container` ).click( function clickPinKeepOpen() {
						if ( $( this ).toggleClass( 'pined' ).hasClass( 'pined' )) {
							api.disable();
						} else {
							api.enable();
						}
					});
				});
				// #### Iframe / HTML
				extend( true, tooltipTypeSpecific, {
					content: {
						text:  redimedInfos['text'],
						title: {
							text: `<span class="itg_pin_container"><svg viewBox="0 0 26 26" class="itg_pin"><use xlink:href="#icon-pin"></use></svg></span><span class="ithoughts_tt_gl-title_with_pin">${  tooltipTypeSpecific.content.title.text  }</span>`,
						},
					},
					style: {
						width: redimedInfos['dims']['width'],
					},
				});
				tooltipTypeSpecific.style.classes += ' ithoughts_tt_gl-force_no_pad ithoughts_tt_gl-video_tip ithoughts_tt_gl-with_pin';
			}
		} else				{
			return;
		}

		// ## Override defaults
		if ( 'true' === $tooltipLink.data( 'tip-autoshow' )) {
			extend( true, tooltipOverrides, {
				show: {
					ready: true,
				},
			});
		}
		if ( 'true' === $tooltipLink.data( 'tip-nosolo' )) {
			extend( true, tooltipOverrides, {
				show: {
					solo: false,
				},
			});
		}
		if ( 'true' === $tooltipLink.data( 'tip-nohide' )) {
			extend( true, tooltipOverrides, {
				hide: 'someevent',
				show: {
					event: 'someevent',
				},
			});
		}
		if ( $tooltipLink.data( 'tip-id' )) {
			extend( true, tooltipOverrides, {
				id: $tooltipLink.data( 'tip-id' ),
			});
		}
		if ( $tooltipLink.data( 'qtip-keep-open' ) || $tooltipLink.hasClass( `itg-mediatip` )) {
			extend( true, tooltipOverrides, {
				hide: {
					fixed: true,
					delay: 250,
				},
			});
		}
		if ( 'true' === $tooltipLink.data( 'tip-prerender' )) {
			extend( true, tooltipOverrides, {
				prerender: true,
			});
		}

		var tooltipOpts = extend( true, tooltipComon, tooltipTypeSpecific, tooltipOverrides, qTipEvents );

		$tooltipLink.qtip( tooltipOpts );

		//Remove title for tooltip, causing double tooltip
		$tooltipLink.find( 'a[title]' ).removeAttr( 'title' );
	});
};

function dom2string( who ) {
	var tmp = $( document.createElement( 'div' ));
	$( tmp ).append( $( who ));
	tmp = tmp.html();
	return tmp;
}

$w.resize( function waitStopRedimVideoRedim() {
	clearTimeout( redimWait );
	redimWait = setTimeout( redimVid, 100 );
});
function redimVid( video ) {
	var h = $w.height(),
		w = $w.width(),
		i = 0,
		dims = [[ 512, 288 ], [ 256, 144 ]],
		l = dims.length;
	for ( ;i < l;i++ ) {
		if ( w > dims[i][0] && h > dims[i][1]) {
			break;
		}
	}
	i = Math.min( dims.length, Math.max( 0, i ));
	var optDims = dims[i];
	if ( 'undefined' === typeof video && typeof optDims !== 'undefined' ) {
		$( '.ithoughts_tt_gl-video' ).prop({
			width:  optDims[0],
			height: optDims[1],
		});
		$( '.ithoughts_tt_gl-video_tip' ).each( function replaceVideoTip() {
			var api = $( this ).qtip( 'api' );/**/
			var state = api.disabled;
			api.enable();/**/
			api.reposition();/**/
			api.disable( state );/**/
		}).css({
			width:  optDims[0],
			height: optDims[1],
		});
	} else if ( !ithoughts.isNA( video )) {
		video.prop({
			width:  optDims[0],
			height: optDims[1],
		}).addClass( 'ithoughts_tt_gl-video' );
		return {
			dims: {
				width:  optDims[0],
				height: optDims[1],
			},
			text: dom2string( video ),
		};
	}
}

$d.ready( function onDocumentReady() {
	itg.doInitTooltips();
});

extend( $.easing, {
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
	easeInBack: function easeInBack( x, t, b, c, d, s ) {
		if ( null == s ) {
			s = 1.70158;
		}
		return c * ( t /= d ) * t * (( s + 1 ) * t - s ) + b;
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
	easeOutBack: function easeOutBack( x, t, b, c, d, s ) {
		if ( null == s ) {
			s = 1.70158;
		}
		return c * (( t = t / d - 1 ) * t * (( s + 1 ) * t + s ) + 1 ) + b;
	},
});

// ------
// ## Definition of default animations

itg.animationFunctions = extend( true, itg.animationFunctions, {
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
			$( this ).show();
		},
		/**
			 * @function zoomin
			 * @description Zoom on the tip: at start, it is invisible because small, at end, it is at normal size
			 * @memberof ithoughts_tooltip_glossary.anim.in
			 * @param {QTip} qtip Tooltip provided by qTip call
			 * @returns {undefined}
			 * @author Gerkin
			 */
		zoomin: function zoomin( qtip ) {
			var $tooltip = $( this ),
				$tip = qtip.elements.tip;
			$tooltip.prop( 'scale_start', $tooltip.prop( 'scale' ) || 0 );
			$tooltip.show().animate({
				z: 1,
			}, {
				progress: function progress( infos, percent, timeLeft ) {
					var factorProgress = $.easing.swing( percent, infos.duration - timeLeft, 0, 1, infos.duration ),
						origFactor = $tooltip.prop( 'scale_start' ) * ( 1 - factorProgress ),
						destFactor = 1 * factorProgress,
						scale = origFactor + destFactor;
					if ( scale !== 1 && scale !== 0 )							{
						$tooltip.prop( 'scale', scale );
					}
					var advance = `scale(${ scale })`,
						origin = $tip.css([ 'left', 'top' ]);
					origin = `${ origin.left  } ${  origin.top  } 0`;
					$tooltip.css({
						'-webkit-transform':        advance,
						'-moz-transform':           advance,
						'transform':                advance,
						'-ms-transform-origin':     origin,
						'-webkit-transform-origin': origin,
						'transform-origin':         origin,
					});
				},
				duration: $tooltip.prop( 'animation_duration' ),
				done:     function done( promise, killed ) {
					if ( isNA( killed ) || !killed ) {
						$tooltip.prop( 'scale', null );
						$tooltip.css({
							'-webkit-transform':        '',
							'-moz-transform':           '',
							'transform':                '',
							'-ms-transform-origin':     '',
							'-webkit-transform-origin': '',
							'transform-origin':         '',
						});
					}
				},
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
			var $tooltip = $( this );
			$tooltip.css({
				display: 'block',
				opacity: 0,
			}).animate({
				opacity: 1,
			}, {
				easing:   'swing',
				duration: $tooltip.prop( 'animation_duration' ),
			});
		},
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
		none:   function none() {},
		/**
			 * @function unhook
			 * @description Makes the tip go a bit up then down with transparency
			 * @memberof ithoughts_tooltip_glossary.anim.out
			 * @param {QTip} qtip Tooltip provided by qTip call
			 * @returns {undefined}
			 * @author Gerkin
			 */
		unhook: function unhook() {
			var $tooltip = $( this );
			$tooltip.animate({
				opacity: 0,
				top:     '+=50',
			}, {
				easing:   'easeInBack',
				duration: $tooltip.prop( 'animation_duration' ),
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
			var $tooltip = $( this );
			$tooltip.animate({
				opacity: 0,
				left:    -100,
			}, {
				easing:   'easeInBack',
				duration: $tooltip.prop( 'animation_duration' ),
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
		zoomout: function zoomout( qtip ) {
			var $tooltip = $( this ),
				$tip = qtip.elements.tip;
			$tooltip.prop( 'scale_start', $tooltip.prop( 'scale' ) || 1 );
			$tooltip.animate({
				z: 1,
			}, {
				progress: function progress( infos, percent, timeLeft ) {
					var factorProgress = $.easing.swing( percent, infos.duration - timeLeft, 0, 1, infos.duration ),
						origFactor = $tooltip.prop( 'scale_start' ) * ( 1 - factorProgress ),
						destFactor = 0,
						scale = origFactor + destFactor;
					if ( scale !== 1 && scale !== 0 )							{
						$tooltip.prop( 'scale', scale );
					}
					var advance = `scale(${ scale })`,
						origin = $tip.css([ 'left', 'top' ]);
					origin = `${ origin.left  } ${  origin.top  } 0`;
					$tooltip.css({
						'-webkit-transform':        advance,
						'-moz-transform':           advance,
						'transform':                advance,
						'-ms-transform-origin':     origin,
						'-webkit-transform-origin': origin,
						'transform-origin':         origin,
					});
				},
				duration: $tooltip.prop( 'animation_duration' ),
				done:     function done( promise, killed ) {
					if ( isNA( killed ) || !killed ) {
						$tooltip.prop( 'scale', null );
						$tooltip.css({
							'-webkit-transform':        '',
							'-moz-transform':           '',
							'transform':                '',
							'-ms-transform-origin':     '',
							'-webkit-transform-origin': '',
							'transform-origin':         '',
						});
					}
				},
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
			var $tooltip = $( this );
			$tooltip.animate({
				opacity: 0,
			}, {
				easing:   'swing',
				duration: $tooltip.prop( 'animation_duration' ),
			});
		},
	},
});
