'use strict';

const removeAccents = require( 'remove-accents' );
const OptArray      = require( '../optarray' );
const comon         = require( '../comon' );

const ithoughts     = ithoughtsCore;
const itg           = iThoughtsTooltipGlossary;
const itge          = iThoughtsTooltipGlossaryEditor;

const isNA = ithoughts.isNA;

const xhrError = xhr => {
	const editor = itge.editor;
	itg.error( 'Error while getting editor form for Tip or List: ', xhr );
	let content = xhr.statusText;
	let title = 'Error getting editor form';
	if ( 403 === xhr.status ) {
		const lang = 'ithoughts_tt_gl_tinymce.error.forbidden';
		content = `<p>${ editor.getLang( `${ lang }.content_1` ) }<br/><a href="javascript:window.location.href=window.location.href">${ editor.getLang( `${ lang }.content_2` ) }</a></p>`;
		title = editor.getLang( `${ lang }.title` );
	}
	itg.growl( title, content, false );
};

const splitAttr = ( attrsStr, separator = /[,\.\s]+/ ) => ( attrsStr || '' ).split( separator ).map( Function.prototype.call, String.prototype.trim ).filter( e => e );

const tristate = val => {
	if ( 'true' === val ) {
		return true;
	}
	if ( 'false' === val ) {
		return false;
	}
	return null;
};

const tipsTypes = [
	'itg-term',
	'itg-tooltip',
	'itg-mediatip',
];
const tipsSelector = tipsTypes.map( type => `[data-type="${ type }"]` ).join( ',' );


const generateSelObject = editor => {
	if ( isNA( editor )) {
		const txtarea = $( '#content' ).get( 0 );
		const sel = {
			html: itge.replaceShortcodes( txtarea.value.substring( txtarea.selectionStart, txtarea.selectionEnd )),
		};
		sel.DOM = $.parseHTML( sel.html );
		$.extend( true, sel, {
			start: $( sel.DOM ).first().get( 0 ),
			end:   $( sel.DOM ).last().get( 0 ),
		});
		return sel;
	} else {
		const tinymceSel = editor.selection;
		const sel = {
			DOM:   $( tinymceSel.getNode()).closest( tipsSelector ).toArray(),
			html:  tinymceSel.getContent({ format: 'html' }),
			start: tinymceSel.getStart(),
			end:   tinymceSel.getEnd(),
		};
		return sel;
	}
};

const displayInForm = data => {
	const $newDom = $( $.parseHTML( data, true ));
	$( document.body ).append( $newDom.css({
		opacity: 1,
	}).animate({
		opacity: 1,
	}, 500 ));
	return $newDom;
};
const hideOutForm = $dom => {
	$dom.animate({ 
		opacity: 0, 
	}, 500, () => { 
		$dom.remove(); 
	});
};

const editorForms = {
	async list( selection ) {
		itg.info( 'Selection infos to load LIST: ', selection );
		let mode = 'insert_content';
		const node = selection.start;
		const values = {
			type:  'atoz',
			alpha: [],
			group: [], 
		};
		if ( !isNA( selection.start ) && selection.start === selection.end ) {
			itg.info( `Start & End node are the same, operating on a node of type ${  node.nodeName }` );
			if ( node && node.nodeName !== '#text' ) {
				const takeAttr = generateTakeAttr( node );
				const type = takeAttr( 'data-type' );
				$.extend( values, {
					alphas: splitAttr( takeAttr( 'data-alphas' )),
					groups: splitAttr( takeAttr( 'data-groups' )),
					'list-contenttype':  takeAttr( 'data-list-contenttype' ),
				});
				if ( 'ithoughts-tooltip-glossary-atoz' === type ) { // Is atoz
					mode = 'load';
					values.type = 'atoz';
				} else if ( 'ithoughts-tooltip-glossary-term_list' === type ) { // Is term_list
					mode = 'load';
					values.type = 'list';
					$.extend( values, {
						cols: parseInt( takeAttr( 'data-cols' )),
					});
				}
			}
		}

		try {
			const resultDom = displayInForm( await comon.sendAjaxQuery( 'get_tinymce_list_form', values, itge.nonce ));

			return new Promise( resolve => {
				itge.finishListTinymce = data => {
					itg.info( 'New list data:', data );
					hideOutForm( resultDom );
					if ( isNA( data )) {
						return;
					}

					const shortcode = `itg-${ data.type }`;
					const tail = ( mode !== 'load' ) ? ' ' : '';
					const optArr = new OptArray();


					const attrs = [ 'alphas', 'groups', 'list-contenttype' ];
					if ( 'glossary' === data.type ) {
						attrs.push( 'cols' );
					}

					attrs.forEach( attr => {
						if ( data.hasOwnProperty( attr )) {
							optArr.addOpt( attr, data[attr]);
						}
					});

					const finalContent = `[${  shortcode  } ${  optArr.toString()  }/]${  tail }`;
					itg.log( 'Final content:', finalContent );
					return resolve({
						finalContent,
						mode, 
					});
				};
			});
		} catch ( error ) {
			xhrError( error );
		}
	},
	async tip( selection, escapeContent ) {
		itg.info( 'Selection infos to load TIP: ', selection );
		const node	= selection.start;
		let values	= {};
		let mode	= '';
		if ( !isNA( selection.start ) && selection.start === selection.end ) {
			itg.info( `Start & End node are the same, operating on a node of type ${  node.nodeName }` );
			const content = ( node && node.text ) || selection.html; // Get node text if any or get selection
			itg.log( 'Loading content: ', content );
			if ( node && node.nodeName !== '#text' && tipsTypes.indexOf( node.getAttribute( 'data-type' )) > -1 ) {
				// On Glossary Term or Tooltip or Mediatip, load data
				mode = 'load';
				const attrs = takeAttr( node );
				const takeAttr = generateTakeAttr( attrs );

				// Pick attributes
				let positionAt = splitAttr( takeAttr( 'position-at' ) || ' ' );
				let positionMy = splitAttr( takeAttr( 'position-my' ) || ' ' );
				const myInverted =
					  ( 1 === Math.max( positionMy.indexOf( 'top' ), positionMy.indexOf( 'bottom' ))) ||
					  ( 0 === Math.max( positionMy.indexOf( 'right' ), positionMy.indexOf( 'left' )));
				positionAt = {
					1: positionAt[0],
					2: positionAt[1],
				};
				positionMy = {
					1:      positionMy[myInverted ? 1 : 0],
					2:      positionMy[myInverted ? 0 : 1],
					invert: myInverted ? 'enabled' : undefined,
				};


				let tooltipContent = takeAttr( 'tooltip-content' );
				if ( escapeContent && tooltipContent ) {
					tooltipContent = tooltipContent.replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' );
				}

				// Create the base value object. It will be filled with other attributes
				values = {
					text:             content,
					link:             takeAttr( 'href', true ),
					gloss:{
						id:      takeAttr( 'gloss-id' ),
						search:      itge.removeAccents( content.toLowerCase()),
						disable_auto_translation: 'true' === ( takeAttr( 'disable_auto_translation' ) || false ),
						contenttype:      takeAttr( 'gloss-contenttype' ),
					},
					tooltip:{
						content:  itg.replaceQuotes( tooltipContent || content, false ),
					},
					mediatip: {
						type:    takeAttr( 'mediatip-type' ),
						content: itg.replaceQuotes( takeAttr( 'mediatip-content' ), false ),
						link:    takeAttr( 'mediatip-link' ),
						caption: takeAttr( 'mediatip-caption' ),
					},
					type:             [ 'glossary', 'tooltip', 'mediatip' ][tipsTypes.indexOf( takeAttr( 'type' ))],
					tip:             {
						keepOpen: 'true' === takeAttr( 'tip-keep-open' ),
						rounded:      tristate( takeAttr( 'tip-rounded' )),
						shadow:       tristate( takeAttr( 'tip-shadow' )),
						style:        takeAttr( 'tip-style' ),
						trigger:      takeAttr( 'tip-trigger' ),
						position:         {
							at:	positionAt,
							my:	positionMy,
						},
						anim: {
							in:   takeAttr( 'tip-anim-in' ),
							out:  takeAttr( 'tip-anim-out' ),
							time: takeAttr( 'tip-anim-time' ),
						},
						maxwidth: takeAttr( 'tip-maxwidth' ),
					},
				};

				// With all attributes left, append them to the attributes option
				values.opts.attributes = attrs;
			} else {
				// Create new gloss
				values	= {
					text:             '',
					link:             '',
					gloss:{
						id:      null,
						search:      '',
						disable_auto_translation: false,
					},
					tooltip:{
						content:  '',
					},
					mediatip: {
						type:    '',
						content: '',
						link:    '',
						caption: '',
					},
					type:             'tooltip',
				};
				// If something is selected, load the content as text, content for tooltip & search
				if ( content && content.length > 0 ) {
					mode	= 'replace_content';
					values	= $.extend( values, {
						text:            content,
						tooltip: {
							content,
						},
						gloss:{
							search:     utils.removeAccents( content.toLowerCase()),
						},
					});
				} else {
					mode	= 'add_content';
				}
			}
		}

		// Then generate form through Ajax

		try {
			const resultDom = displayInForm( await comon.sendAjaxQuery( 'get_tinymce_tooltip_form', values, itge.nonce ));

			return new Promise( resolve => {
				itge.finishTipTinymce = data => {
					hideOutForm( resultDom );
					itg.info( 'New tooltip data:', data );
					if ( isNA( data )) {
						return;
					}
					const optArr = new OptArray();
					const attributesList = resultDom.find( '#attributes-list option' ).map( elem => elem.value ).toArray();
					const shortcode = `itg-${  data.type }`;
					const tail = ( mode !== 'load' && 0 === content.length ) ? ' ' : '';
					// Get new options, or old one
					const opts = data.opts || values.opts;
					const optsAttrs = ( opts && opts.attributes ) || {};

					if ( !isNA( opts )) {
						optArr.maybeAddOpt( opts['gloss-contenttype'], 'data-gloss-contenttype', opts['gloss-contenttype']);
						optArr.maybeAddOpt( opts['tip-keep-open'], 'data-tip-keep-open', 'true' );
						optArr.maybeAddOpt( !isNA( opts.tipRounded ), 'data-tip-rounded', String( opts.tipRounded ));
						optArr.maybeAddOpt( !isNA( opts.tipShadow ), 'data-tip-shadow', String( opts.tipShadow ));
						optArr.maybeAddOpt( opts.tipStyle, 'data-tip-style', opts.tipStyle );
						optArr.maybeAddOpt( opts.tipTrigger, 'data-tip-trigger', opts.tipTrigger );
						if ( opts.position ) {
							if ( opts.position.at && opts.position.at[1] && opts.position.at[2]) {
								optArr.addOpt( 'data-position-at', `${ opts.position.at[1] } ${  opts.position.at[2] }` );
							}
							if ( opts.position.my && opts.position.my[1] && opts.position.my[2]) {
								const my = [ opts.position.my[1], opts.position.my[2] ];
								if ( opts.position.my.invert ) {
									my.reverse();
								}
								optArr.addOpt( 'data-position-my', my.join( ' ' ));
							}
						}
						if ( opts.anim ) {
							optArr.maybeAddOpt( opts.anim.in, 'data-tip-anim-in', opts.anim.in );
							optArr.maybeAddOpt( opts.anim.out, 'data-tip-anim-out', opts.anim.out );
							optArr.maybeAddOpt( opts.anim.time, 'data-tip-anim-time', opts.anim.time );
						}
						optArr.maybeAddOpt( opts.maxwidth, 'data-tip-maxwidth', opts.maxwidth );
						/*if ( optsAttrs.hasOwnProperty( type )) {
								for ( j in optsAttrs[type]) {
									if ( optsAttrs[type].hasOwnProperty( j )) {
										const prefix = attributesList.indexOf( j ) > -1 && !j.startsWith( 'data-' ) ? '' : 'data-';
										const midPart = 'link' === type ? 'link-' : '';
										optArr.addOpt( prefix + midPart + j, optsAttrs[type][j], true );
									}
								}
							}*/
					}
					optArr.maybeAddOpt( opts.link, 'href', encodeURI( data.link ));

					if ( 'gloss' === data.type ) {
						if ( !data.glossId || !data.text ) {
							return;
						} else {
							optArr.addOpt( 'glossId', data.glossId );
							if ( data.disable_auto_translation ) {
								optArr.addOpt( 'disable_auto_translation', 'true' );
							}
						}
					} else if ( 'tooltip' === data.type ) {
						if ( !data.tooltip_content || !data.text ) {
							return;
						} else {
							addOpt( 'tooltip-content', escapeContent ? data.tooltip_content.replace( /</g, '&lt;' ).replace( />/g, '&gt;' ) : data.tooltip_content, true );
						}
					} else if ( 'mediatip' === data.type ) {
						if ( !data.mediatip_type || !data.mediatip_content || !data.text ) {
							return;
						} else {
							addOpt( 'mediatip-type', data.mediatip_type );
							addOpt( 'mediatip-content', data.mediatip_content, true );
							if ( data.mediatipCaption ) {
								addOpt( 'mediatip-caption', data.mediatipCaption, true );
							}
						}
					}
					const finalContent = `[${  shortcode  } ${  optArr.toString()  }]${  data.text  }[/${  shortcode  }]${  tail }`;
					itg.log( 'Final content:', finalContent );
					return resolve({
						finalContent,
						mode, 
					});
				};
			});
		} catch ( error ) {
			xhrError( error );
		}
	},
};

const utils = {
	editorForms,
	generateSelObject,
	hideOutForm,
	tipsTypes,
	tipsSelector,
	removeAccents,
};

module.exports = utils;
