'use strict';

const removeAccents = require('remove-accents');
const OptArray      = require('./tinymce-optarray');

const ithoughts     = iThoughts.v5;
const itg           = iThoughtsTooltipGlossary;
const itge          = iThoughtsTooltipGlossaryEditor;

const isNA = ithoughts.isNA;

const xhrError = xhr => {
	const editor = itge.editor;
	itg.error( 'Error while getting TinyMCE form for Tip or List: ', xhr );
	if ( 403 === xhr.status ) {
		const lang = 'ithoughts_tt_gl_tinymce.error.forbidden';
		$( $.parseHTML( `<p>${ editor.getLang( `${lang}.content_1` ) }<br/><a href="javascript:window.location.href=window.location.href">${ editor.getLang( `${lang}.content_2` ) }</a></p>` )).dialog({
			title:  editor.getLang( `${lang}.title` ),
			modale: true,
		});
	}
};

const splitAttr = (attrsStr, separator = /[,\.\s]+/) => ( attrsStr || '' ).split( separator ).map( Function.prototype.call, String.prototype.trim ).filter( e => e);

const extractAttrs = node => {
	const ret = {};
	node.attributes.forEach(attr => {
		ret[attr.nodeName] = attr.nodeValue;
	});
	return ret;
}

const generateTakeAttr = attrs => {
	// If we received a node instead of an object, extract its attributes
	if(attrs instanceof Element){
		attrs = extractAttrs(attrs);
	}
	// Return the picker function
	return ( label, noDataPrefix = false ) => {
		if ( !noDataPrefix ) {
			label = `data-${  label }`;
		}
		const val = attrs[label];
		delete attrs[label];
		return val;
	};
};

const tristate = val => {
	if ( 'true' === val ) {
		return true;
	}
	if ( 'false' === val ) {
		return false;
	}
	return null;
};

const sendAjaxQuery = async(action, data, nonce = itge.nonce) => {
	const loader = ithoughts.makeLoader();
	return new Promise((resolve, reject) => {
		$.ajax({
			method:	'POST',
			async:  true,
			url:    itge.admin_ajax,
//			dataType: 'json',
			data:   {
				action:   `ithoughts_tt_gl_${action}`,
				_wpnonce: nonce,
				data,
			},
			success(data){
				loader.remove();
				return resolve(data);
			},
			error(xhr){
				loader.remove();
				return reject(xhr);
			},
		});
	});
}

const generateSelObject = editor => {
	if(isNA(editor)){
		const tinymceSel = editor.selection;
		const sel = {
			DOM: $( tinymceSel.getNode()).closest( tipsSelector ).toArray(),
			html: tinymceSel.getContent({ format: 'html' }),
			start: tinymceSel.getStart(),
			end: tinymceSel.getEnd(),
		};
		return sel;
	} else{
		var txtarea = $( '#content' ).get( 0 );
		var sel = {
			html: itge.replaceShortcodes( txtarea.value.substring( txtarea.selectionStart, txtarea.selectionEnd )),
		};
		sel.DOM = $.parseHTML( sel.html );
		$.extend(true, sel, {
			start: $( sel.DOM ).first().get( 0 ),
			end: $( sel.DOM ).last().get( 0 ),
		});
		return sel;
	}
}

const displayInForm = data => {
	const $newDom = $( $.parseHTML( data, true ));
	$( document.body ).append( $newDom.css({
		opacity: 1,
	}).animate({
		opacity: 1,
	}, 500 ));
	return $newDom;
}
const hideOutForm = $dom => {
	$dom.animate({ 
		opacity: 0, 
	}, 500, () => { 
		$dom.remove(); 
	});
}

const editorForms = {
	async list( selection ) {
		itg.info( 'Selection infos to load LIST: ', selection );
		let mode = 'insert_content';
		const node = selection.start;
		const values = { type:  'atoz', alpha: [], group: [] };
		if ( !isNA( selection.start ) && selection.start === selection.end ) {
			itge.log( `Start & End node are the same, operating on a node of type ${  node.nodeName }` );
			if ( node && node.nodeName !== '#text' ) {
				const takeAttr = generateTakeAttr(node);
				const type = takeAttr('data-type');
				$.extend( values, {
					alpha: splitAttr( takeAttr( 'data-alpha' )),
					group: splitAttr( takeAttr( 'data-group' )),
					desc: takeAttr( 'data-desc' ),
				});
				if ( 'ithoughts-tooltip-glossary-atoz' === type) { // Is atoz
					mode = 'load';
					values.type = 'atoz';
				} else if ( 'ithoughts-tooltip-glossary-term_list' === type) { // Is term_list
					mode = 'load';
					values.type = 'list';
					$.extend( values, {
						cols: parseInt( takeAttr( 'data-cols' )),
					});
				}
			}
		}

		try{
			const resultDom = displayInForm(await sendAjaxQuery('get_tinymce_list_form', values));

			return new Promise(resolve => {
				itge.finishListTinymce = data => {
					hideOutForm(resultDom);
					if ( isNA(data) ) {
						return;
					}

					const shortcode = `glossary_${  ({
						atoz: 'atoz',
						list: 'term_list',
					})[data.type] }`;
					const tail = ( mode !== 'load' ) ? ' ' : '';
					const optArr = new OptArray();


					const attrs = [ 'alpha', 'group' ];
					if ( 'list' === data.type ) {
						attrs.push('cols', 'desc');
					}

					attrs.forEach(attr => {
						if ( data.hasOwnProperty( attr )) {
							optArr.addOpt( attr, data[attr]);
						}
					});

					const finalContent = `[${  shortcode  } ${  optArr.toString()  }/]${  tail }`;
					itg.log( 'Final content:', finalContent );
					return resolve({ finalContent, mode });
				};
			});
		} catch(error){
			xhrError(error);
		}
	},
	async tip( selection, escapeContent ) {
		itg.info( 'Selection infos to load TIP: ', selection );
		const node	= selection.start;
		let values	= {};
		let mode	= '';
		if ( !isNA( selection.start ) && selection.start === selection.end ) {
			itge.log( `Start & End node are the same, operating on a node of type ${  node.nodeName }` );
			const content = ( node && node.text ) || selection.html; // Get node text if any or get selection
			itge.log( 'Loading content: ', content );
			if ( node && node.nodeName !== '#text' && tipsTypes.indexOf( node.getAttribute( 'data-type' )) > -1 ) {
				// On Glossary Term or Tooltip or Mediatip, load data
				mode = 'load';
				const attrs = takeAttr(node);
				const takeAttr = generateTakeAttr(attrs);

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
					tooltip_content:  itg.stripQuotes( tooltipContent || content, false ),
					glossary_id:      takeAttr( 'glossary-id' ),
					term_search:      itge.removeAccents( content.toLowerCase()),
					mediatip_type:    takeAttr( 'mediatip-type' ),
					mediatip_content: itg.stripQuotes( takeAttr( 'mediatip-content' ), false ),
					mediatip_link:    takeAttr( 'mediatip-link' ),
					mediatip_caption: takeAttr( 'mediatip-caption' ),
					type:             [ 'glossary', 'tooltip', 'mediatip' ][tipsTypes.indexOf( takeAttr( 'type' ))],
					opts:             {
						termcontent:      takeAttr( 'termcontent' ),
						'qtip-keep-open': 'true' === takeAttr( 'qtip-keep-open' ),
						qtiprounded:      tristate( takeAttr( 'qtiprounded' )),
						qtipshadow:       tristate( takeAttr( 'qtipshadow' )),
						qtipstyle:        takeAttr( 'qtipstyle' ),
						qtiptrigger:      takeAttr( 'qtiptrigger' ),
						position:         {
							at:	positionAt,
							my:	positionMy,
						},
						attributes:	{
							span: {},
							link:	{},
						},
						anim: {
							in:   takeAttr( 'animation_in' ),
							out:  takeAttr( 'animation_out' ),
							time: takeAttr( 'animation_time' ),
						},
						maxwidth: takeAttr( 'tooltip-maxwidth' ),
					},

					glossary_disable_auto_translation: 'true' === ( takeAttr( 'disable_auto_translation' ) || false ),
				};

				// With all attributes left, append them to the attributes option
				for ( const i in attrs ) {
					if ( attrs.hasOwnProperty( i )) {
						if ( i.match( /^data-link-/ )) {
							values.opts.attributes.link[i.replace( /^data-link-(data-)?/, '' )] = attrs[i];
						} else {
							values.opts.attributes.span[i.replace( /^data-/, '' )] = attrs[i];
						}
					}
				}
			} else {
				// Create new glossary term
				values	= {
					text:             '',
					link:             '',
					tooltip_content:  '',
					glossary_id:      null,
					term_search:      '',
					mediatip_type:    '',
					mediatip_content: '',
					mediatip_caption: '',
					type:             'tooltip',

					glossary_disable_auto_translation:	false,
				};
				// If something is selected, load the content as text, content for tooltip & search
				if ( content && content.length > 0 ) {
					mode	= 'replace_content';
					values	= $.extend( values, {
						text:            content,
						tooltip_content: content,
						term_search:     itge.removeAccents( content.toLowerCase()),
					});
				} else {
					mode	= 'add_content';
				}
			}
		}

		// Then generate form through Ajax

		try{
			const resultDom = await displayInForm(sendAjaxQuery('get_tinymce_tip_form', values));

			return new Promise(resolve => {
				itge.finishListTinymce = data => {
					hideOutForm(resultDom);
					itge.info( 'New tooltip data:', data );
					if ( isNA(data) ) {
						return;
					}
					const optArr = new OptArray();
					const attributesList = resultDom.find( '#attributes-list option' ).map( elem => elem.value ).toArray();
					const types = [ 'span', 'link' ];
					const shortcode = `itg-${  data.type }`;
					const tail = ( mode !== 'load' && 0 === content.length ) ? ' ' : '';
					// Get new options, or old one
					const opts = data.opts || values.opts;
					const optsAttrs = ( opts && opts.attributes ) || {};

					if ( !isNA( opts )) {
						optArr.maybeAddOpt( opts['qtip-content'], 'data-termcontent', opts['qtip-content']);
						optArr.maybeAddOpt( opts['qtip-keep-open'], 'data-qtip-keep-open', 'true' );
						optArr.maybeAddOpt( !isNA( opts.qtiprounded ), 'data-qtiprounded', String( opts.qtiprounded ));
						optArr.maybeAddOpt( !isNA( opts.qtipshadow ), 'data-qtipshadow', String( opts.qtipshadow ));
						optArr.maybeAddOpt( opts.qtipstyle , 'data-qtipstyle', opts.qtipstyle );
						optArr.maybeAddOpt( opts.qtiptrigger , 'data-qtiptrigger', opts.qtiptrigger );
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
							optArr.maybeAddOpt( opts.anim.in, 'data-animation_in', opts.anim.in);
							optArr.maybeAddOpt( opts.anim.out, 'data-animation_out', opts.anim.out );
							optArr.maybeAddOpt( opts.anim.time, 'data-animation_time', opts.anim.time );
						}
						optArr.maybeAddOpt( opts.maxwidth, 'data-tooltip-maxwidth', opts.maxwidth );
						types.forEach(type => {
							if ( optsAttrs.hasOwnProperty( type )) {
								for ( j in optsAttrs[type]) {
									if ( optsAttrs[type].hasOwnProperty( j )) {
										const prefix = attributesList.indexOf( j ) > -1 && !j.startsWith( 'data-' ) ? '' : 'data-';
										const midPart = 'link' === type ? 'link-' : '';
										optArr.addOpt( prefix + midPart + j, optsAttrs[type][j], true );
									}
								}
							}
						});
					}
					optArr.maybeAddOpt( opts.link, 'href', encodeURI( data.link ) );

					if ( 'glossary' === data.type ) {
						if ( !data.glossary_id || !data.text ) {
							return;
						} else {
							optArr.addOpt( 'glossary-id', data.glossary_id );
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
							if ( data.mediatip_caption ) {
								addOpt( 'mediatip-caption', data.mediatip_caption, true );
							}
						}
					}
					const finalContent = `[${  shortcode  } ${  optArr.toString()  }]${  data.text  }[/${  shortcode  }]${  tail }`;
					itg.log( 'Final content:', finalContent );
					return resolve({ finalContent, mode });
				};
			});
		} catch(error){
			xhrError(error);
		}
	},
};

module.exports = {
	editorForms,
	generateSelObject,
	sendAjaxQuery,
	hideOutForm,
};