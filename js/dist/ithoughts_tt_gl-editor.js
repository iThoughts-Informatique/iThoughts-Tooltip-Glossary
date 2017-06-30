/**
 * @file Script loaded as soon a post editor is opened. It contains all basic functions to insert shortcodes
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPLv3
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

/*global QTags: false, iThoughtsTooltipGlossaryEditor: false */

'use strict';

/**
 * @function initTinyMCEPlugin
 * @description Namespace & register both term & list TinyMCE plugins for iThoughts Tooltip Glossary
 * @param {Object} ithoughts Appropriate version of iThoughts Tooltip Glossary helper
 */

(function initTinyMCEPlugin(ithoughts) {
	ithoughts.$d.ready(function onDocumentReady() {
		var $ = ithoughts.$,
		    itg = iThoughtsTooltipGlossary,
		    itge = iThoughtsTooltipGlossaryEditor,
		    stripQuotes = itg.stripQuotes,
		    prefix3 = 'ithoughts-tooltip-glossary',
		    prefix4 = 'itg',
		    tipsTypes = ['ithoughts-tooltip-glossary-term', 'ithoughts-tooltip-glossary-tooltip', 'ithoughts-tooltip-glossary-mediatip'],
		    htmlAttrs = ['href'],
		    isNA = ithoughts.isNA;

		ithoughts.initLoggers(itge, 'iThoughts Tooltip Glossary', itge.verbosity);
		itge.removeAccents = function removeAccents(s) {
			var translateRegex = /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g,
			    translate = {
				'¹': '1',
				'²': '2',
				'³': '3',
				'á': 'a',
				'à': 'a',
				'â': 'a',
				'ã': 'a',
				'ä': 'a',
				'å': 'a',
				a: 'a',
				'À': 'a',
				'Á': 'a',
				'Â': 'a',
				'Ã': 'a',
				'Ä': 'a',
				'Å': 'a',
				A: 'a',
				'Æ': 'a',
				c: 'c',
				'ç': 'c',
				'©': 'c',
				C: 'c',
				'Ç': 'c',
				'Ð': 'd',
				'è': 'e',
				'é': 'e',
				'ê': 'e',
				'?': 's',
				'ë': 'e',
				e: 'e',
				'È': 'e',
				'Ê': 'e',
				'Ë': 'e',
				E: 'e',
				'€': 'e',
				g: 'g',
				G: 'g',
				i: 'i',
				'ì': 'i',
				'í': 'i',
				'î': 'i',
				'ï': 'i',
				'Ì': 'i',
				'Í': 'i',
				'Î': 'i',
				'Ï': 'i',
				I: 'i',
				l: 'l',
				L: 'l',
				n: 'n',
				'ñ': 'n',
				N: 'n',
				'Ñ': 'n',
				'ò': 'o',
				'ó': 'o',
				'ô': 'o',
				'õ': 'o',
				'ö': 'o',
				o: 'o',
				'ø': 'o',
				'Ò': 'o',
				'Ó': 'o',
				'Ô': 'o',
				'Õ': 'o',
				'Ö': 'o',
				O: 'o',
				'Ø': 'o',
				'Œ': 'o',
				r: 'r',
				'®': 'r',
				R: 'r',
				'š': 's',
				s: 's',
				'ß': 's',
				'Š': 's',
				S: 's',
				'ù': 'u',
				'ú': 'u',
				'û': 'u',
				'ü': 'u',
				u: 'u',
				'Ù': 'u',
				'Ú': 'u',
				'Û': 'u',
				'Ü': 'u',
				U: 'u',
				'ý': 'y',
				'ÿ': 'y',
				'Ý': 'y',
				'Ÿ': 'y',
				'ž': 'z',
				z: 'z',
				'Ž': 'z',
				Z: 'z'
			};
			return s.replace(translateRegex, function doReplace(match) {
				return translate[match];
			});
		};

		itge.replaceShortcodes = function replaceShortcodes(content) {
			var repLength = itge.replaceShortcodesEl.length,
			    i = -1;
			while ((i += 1) < repLength) {
				content = itge.replaceShortcodesEl[i](content);
			}
			return content;
		};
		itge.restoreShortcodes = function restoreShortcodes(content) {
			var resLength = itge.restoreShortcodesEl.length,
			    i = -1;
			while ((i += 1) < resLength) {
				content = itge.restoreShortcodesEl[i](content);
			}
			return content;
		};
		itge.replaceShortcodesEl = [function replaceShortcodeElGlossary(content) {
			// For [glossary]
			return content.replace(/\[(?:itg-)?(glossary|tooltip|mediatip)(?!_)(.*?)\](.*?)\[\/(?:itg-)?(glossary|tooltip|mediatip)\]/g, function doReplace(all, balise, inner, text) {
				var attrs = {},
				    regex = /([\w\d\-]+?)="(.+?)"/g,
				    matched = null,
				    ret = '<a data-type="' + prefix3 + '-' + {
					glossary: 'term',
					tooltip: 'tooltip',
					mediatip: 'mediatip'
				}[balise] + '"',
				    i;
				while (true === Boolean(matched = regex.exec(inner))) {
					attrs[matched[1]] = matched[2];
				}
				for (i in attrs) {
					if (attrs.hasOwnProperty(i)) {
						if (htmlAttrs.indexOf(i) > -1 || 0 === i.indexOf('data-')) {
							ret += ' ' + i + '="' + attrs[i] + '"';
						} else {
							ret += ' data-' + i + '="' + attrs[i] + '"';
						}
					}
				}
				return ret + '>' + text + '</a>';
			});
		}, function replaceShortcodeElList(content) {
			// For [glossary_(term_list|atoz)]
			return content.replace(/\[glossary_(term_list|atoz)(.*?)\/\]/g, function doReplace(all, type, attrStr) {
				var attrs = {},
				    regex = /([\w\d\-]+?)="(.+?)"/g,
				    matched = null,
				    ret = '<span data-type="' + prefix3 + '-' + type + '"',
				    i;
				while (true === Boolean(matched = regex.exec(attrStr))) {
					attrs[matched[1]] = matched[2];
				}
				for (i in attrs) {
					if (attrs.hasOwnProperty(i)) {
						if (htmlAttrs.indexOf(i) > -1 || 0 === i.indexOf('data-')) {
							ret += ' ' + i + '="' + attrs[i] + '"';
						} else {
							ret += ' data-' + i + '="' + attrs[i] + '"';
						}
					}
				}
				return ret + '>Glossary ' + ('term_list' === type ? 'List' : 'A-to-Z') + '</span>';
			});
		}];
		itge.restoreShortcodesEl = [function restoreShortcodeElGlossary(content) {
			// For [glossary]
			return content.replace(/<a\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term|tooltip|mediatip)")(.*?)>(.*?)<\/a>/g, function doReplace(all, type, inner, text) {
				var attrs = {},
				    regex = /(data-)?([\w\d\-]+?)="(.+?)"/g,
				    matched = null,
				    b = {
					term: 'glossary',
					tooltip: 'tooltip',
					mediatip: 'mediatip'
				}[type],
				    ret = '[' + prefix4 + '-' + b,
				    i;
				while (true === Boolean(matched = regex.exec(inner))) {
					if (matched[1] !== 'data-' || matched[2] !== 'type') {
						if (htmlAttrs.indexOf(matched[2]) > -1 && typeof matched[1] !== 'undefined') {
							attrs[matched[1] + matched[2]] = matched[3];
						} else {
							attrs[matched[2]] = matched[3];
						}
					}
				}
				for (i in attrs) {
					if (attrs.hasOwnProperty(i)) {
						ret += ' ' + i + '="' + attrs[i] + '"';
					}
				}
				return ret + ']' + text + '[/' + prefix4 + '-' + b + ']';
			});
		}, function restoreShortcodeElList(content) {
			// For [glossary_(term_list|atoz)]
			return content.replace(/<span\s+(?=[^>]*data-type="ithoughts-tooltip-glossary-(term_list|atoz)")(.*?)>.*?<\/span>/g, function doReplace(all, type, attrStr) {
				var attrs = {},
				    regex = /(data-)?([\w\d\-]+?)="(.+?)"/g,
				    matched = null,
				    ret = '[glossary_' + type,
				    i;
				while (true === Boolean(matched = regex.exec(attrStr))) {
					if (matched[1] !== 'data-' || matched[2] !== 'type') {
						if (htmlAttrs.indexOf(i) > -1 && typeof matched[1] !== 'undefined') {
							attrs[matched[1] + matched[2]] = matched[3];
						} else {
							attrs[matched[2]] = matched[3];
						}
					}
				}
				for (i in attrs) {
					if (attrs.hasOwnProperty(i)) {
						ret += ' ' + i + '="' + attrs[i] + '"';
					}
				}
				return ret + '/]';
			});
		}];

		itge.editorForms = {
			list: function list(selection, callback) {
				itge.log('Selection infos to load TIP: ', selection);
				var mode = 'insert_content',
				    node = selection.start,
				    values = {
					type: 'atoz',
					alpha: [],
					group: []
				},
				    loader;
				function trimFilter(attrsStr) {
					return (attrsStr || '').split(',').map(Function.prototype.call, String.prototype.trim).filter(function filterNonNullAttr(e) {
						return e;
					});
				}
				if (!isNA(selection.start) && selection.start === selection.end) {
					itge.log('Start & End node are the same, operating on a node of type ' + node.nodeName);
					if (node && node.nodeName !== '#text') {
						$.extend(values, {
							alpha: trimFilter(node.getAttribute('data-alpha')),
							group: trimFilter(node.getAttribute('data-group'))
						});
						if ('ithoughts-tooltip-glossary-atoz' === node.getAttribute('data-type')) {
							// Is atoz
							mode = 'load';
							values.type = 'atoz';
						} else if ('ithoughts-tooltip-glossary-term_list' === node.getAttribute('data-type')) {
							// Is term_list
							mode = 'load';
							values.type = 'list';
							$.extend(values, {
								cols: parseInt(node.getAttribute('data-cols')),
								desc: node.getAttribute('data-desc')
							});
						}
					}
				}

				// Then generate form through Ajax
				loader = ithoughts.makeLoader();
				$.ajax({
					method: 'POST',
					async: true,
					url: itge.admin_ajax,
					data: {
						action: 'ithoughts_tt_gl_get_tinymce_list_form',
						data: values
					},
					success: function success(out) {
						loader.remove();
						var newDom = $($.parseHTML(out, true));

						$(document.body).append(newDom.css({
							opacity: 0
						}).animate({
							opacity: 1
						}, 500));

						itge.finishListTinymce = function finishListTinymce() {
							var domC = newDom;
							return function handleFormSubmitted(data) {
								itge.info('New list data:', data);
								domC.animate({
									opacity: 0
								}, 500, function animateEnd() {
									domC.remove();
								});
								if ('undefined' === typeof data) {
									return;
								}

								var shortcode = 'glossary_' + {
									atoz: 'atoz',
									list: 'term_list'
								}[data.type],
								    tail = mode !== 'load' ? ' ' : '',
								    optsStrs = [],
								    addOpt = function addOpt(label, value, specEncode) {
									optsStrs.push(generateAttr(label, value, specEncode));
									optsStrs = optsStrs.filter(function filterNoNA(val) {
										return !isNA(val);
									});
								};

								var attrs = ['alpha', 'group'];
								switch (data.type) {
									case 'list':
										{
											attrs = attrs.concat(['cols', 'desc']);
										}break;
								}

								for (var i = 0, I = attrs.length; i < I; i++) {
									var attr = attrs[i];
									if (data.hasOwnProperty(attr)) {
										addOpt(attr, data[attr]);
									}
								}

								var finalContent = '[' + shortcode + ' ' + optsStrs.join(' ') + '/]' + tail;
								itge.log('Final content:', finalContent);
								return callback(finalContent, mode);
							};
						}();
					},
					error: function error() {
						loader.remove();
						itge.error('Error while getting TinyMCE form for Tip: ', arguments);
					}
				});
			},
			tip: function tip(selection, callback, escapeContent) {
				itge.info('Selection infos to load TIP: ', selection);
				var values = {},
				    node = selection.start,
				    mode = '',
				    i = -1,
				    content,
				    atts,
				    attsLength,
				    attrs,
				    att,
				    takeAttr,
				    positionAt,
				    positionMy,
				    myInverted,
				    tristate,
				    loader;
				if (!isNA(selection.start) && selection.start === selection.end) {
					itge.log('Start & End node are the same, operating on a node of type ' + node.nodeName);
					content = node && node.text || selection.html; // Get node text if any or get selection
					itge.log('Loading content: ', content);
					if (node && node.nodeName !== '#text' && tipsTypes.indexOf(node.getAttribute('data-type')) > -1) {
						// On Glossary Term or Tooltip or Mediatip, load data
						mode = 'load';
						attrs = {};
						atts = node.attributes;
						attsLength = atts.length;
						while ((i += 1) < attsLength) {
							att = atts[i];
							attrs[att.nodeName] = att.nodeValue;
						}
						takeAttr = function takeAttr(label, nodata) {
							if (isNA(nodata) || !nodata) {
								label = 'data-' + label;
							}
							var val = attrs[label];
							delete attrs[label];
							return val;
						};

						positionAt = (takeAttr('position-at') || ' ').split(' ');
						positionMy = (takeAttr('position-my') || ' ').split(' ');
						myInverted = 1 === Math.max(positionMy.indexOf('top'), positionMy.indexOf('bottom')) || 0 === Math.max(positionMy.indexOf('right'), positionMy.indexOf('left'));
						positionAt = {
							1: positionAt[0],
							2: positionAt[1]
						};
						positionMy = {
							1: positionMy[myInverted ? 1 : 0],
							2: positionMy[myInverted ? 0 : 1],
							invert: myInverted ? 'enabled' : undefined
						};

						tristate = function tristate(val) {
							if ('true' === val) {
								return true;
							}
							if ('false' === val) {
								return false;
							}
							return null;
						};

						var tooltipContent = takeAttr('tooltip-content');
						if (escapeContent && tooltipContent) {
							tooltipContent = tooltipContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						}

						values = {
							text: content,
							link: takeAttr('href', true),
							tooltip_content: stripQuotes(tooltipContent || content, false),
							glossary_id: takeAttr('glossary-id'),
							term_search: itge.removeAccents(content.toLowerCase()),
							mediatip_type: takeAttr('mediatip-type'),
							mediatip_content: stripQuotes(takeAttr('mediatip-content'), false),
							mediatip_link: takeAttr('mediatip-link'),
							mediatip_caption: takeAttr('mediatip-caption'),
							type: ['glossary', 'tooltip', 'mediatip'][tipsTypes.indexOf(takeAttr('type'))],
							opts: {
								termcontent: takeAttr('termcontent'),
								'qtip-keep-open': 'true' === takeAttr('qtip-keep-open'),
								qtiprounded: tristate(takeAttr('qtiprounded')),
								qtipshadow: tristate(takeAttr('qtipshadow')),
								qtipstyle: takeAttr('qtipstyle'),
								qtiptrigger: takeAttr('qtiptrigger'),
								position: {
									at: positionAt,
									my: positionMy
								},
								attributes: {
									span: {},
									link: {}
								},
								anim: {
									in: takeAttr('animation_in'),
									out: takeAttr('animation_out'),
									time: takeAttr('animation_time')
								},
								maxwidth: takeAttr('tooltip-maxwidth')
							},

							glossary_disable_auto_translation: 'true' === (takeAttr('disable_auto_translation') || false)
						};
						for (i in attrs) {
							if (attrs.hasOwnProperty(i)) {
								if (i.match(/^data-link-/)) {
									values.opts.attributes.link[i.replace(/^data-link-(data-)?/, '')] = attrs[i];
								} else {
									values.opts.attributes.span[i.replace(/^data-/, '')] = attrs[i];
								}
							}
						}
					} else {
						// Create new glossary term
						values = {
							text: '',
							link: '',
							tooltip_content: '',
							glossary_id: null,
							term_search: '',
							mediatip_type: '',
							mediatip_content: '',
							mediatip_caption: '',
							type: 'tooltip',

							glossary_disable_auto_translation: false
						};
						// If something is selected, load the content as text, content for tooltip & search
						if (content && content.length > 0) {
							mode = 'replace_content';
							values = $.extend(values, {
								text: content,
								tooltip_content: content,
								term_search: itge.removeAccents(content.toLowerCase())
							});
						} else {
							mode = 'add_content';
						}
					}
				}

				// Then generate form through Ajax
				loader = ithoughts.makeLoader();
				$.ajax({
					method: 'POST',
					async: true,
					url: itge.admin_ajax,
					data: {
						action: 'ithoughts_tt_gl_get_tinymce_tooltip_form',
						data: values,
						_wpnonce: itge.nonce
					},
					success: function success(out) {
						loader.remove();
						var newDom = $($.parseHTML(out, true));
						$(document.body).append(newDom.css({
							opacity: 1
						}).animate({
							opacity: 1
						}, 500));

						itge.finishTipTinymce = function finishTipTinymce() {
							var domC = newDom;
							return function handleFormSubmitted(data) {
								itge.info('New tooltip data:', data);
								domC.animate({
									opacity: 0
								}, 500, function animateAfter() {
									domC.remove();
								});
								if ('undefined' === typeof data || null === data) {
									return;
								}
								var optsStrs = [],
								    attributesList = domC.find('#attributes-list option').map(function domToValue() {
									return this.value;
								}).toArray(),
								    opts = data.opts || values.opts,
								    addOpt = function addOpt(label, value, specEncode) {
									optsStrs.push(generateAttr(label, value, specEncode));
									optsStrs = optsStrs.filter(function filterNoNA(val) {
										return !isNA(val);
									});
								},
								    my,
								    types = ['span', 'link'],
								    typesLength = types.length,
								    i = -1,
								    j,
								    prefix,
								    midPart,
								    optsAttrs = opts && opts.attributes || {},
								    shortcode = prefix4 + '-' + data.type,
								    tail = mode !== 'load' && 0 === content.length ? ' ' : '';

								if (!isNA(opts)) {
									if (opts['qtip-content']) {
										addOpt('data-termcontent', opts['qtip-content']);
									}
									if (opts['qtip-keep-open']) {
										addOpt('data-qtip-keep-open', 'true');
									}
									if (!isNA(opts.qtiprounded)) {
										addOpt('data-qtiprounded', String(opts.qtiprounded));
									}
									if (!isNA(opts.qtipshadow)) {
										addOpt('data-qtipshadow', String(opts.qtipshadow));
									}
									if (opts.qtipstyle) {
										addOpt('data-qtipstyle', opts.qtipstyle);
									}
									if (opts.qtiptrigger) {
										addOpt('data-qtiptrigger', opts.qtiptrigger);
									}
									if (opts.position) {
										if (opts.position.at && opts.position.at[1] && opts.position.at[2]) {
											addOpt('data-position-at', opts.position.at[1] + ' ' + opts.position.at[2]);
										}
										if (opts.position.my && opts.position.my[1] && opts.position.my[2]) {
											my = [opts.position.my[1], opts.position.my[2]];
											if (opts.position.my.invert) {
												my.reverse();
											}
											addOpt('data-position-my', my.join(' '));
										}
									}
									if (opts.anim) {
										if (opts.anim['in']) {
											addOpt('data-animation_in', opts.anim['in']);
										}
										if (opts.anim.out) {
											addOpt('data-animation_out', opts.anim.out);
										}
										if (opts.anim.time) {
											addOpt('data-animation_time', opts.anim.time);
										}
									}
									if (opts.maxwidth) {
										addOpt('data-tooltip-maxwidth', opts.maxwidth);
									}
									while (i++ < typesLength) {
										var type = types[i];
										if (optsAttrs.hasOwnProperty(type)) {
											for (j in optsAttrs[type]) {
												if (optsAttrs[type].hasOwnProperty(j)) {
													prefix = attributesList.indexOf(j) > -1 && !j.startsWith('data-') ? '' : 'data-';
													midPart = 'link' === type ? 'link-' : '';
													addOpt(prefix + midPart + j, optsAttrs[type][j], true);
												}
											}
										}
									}
								}
								if (data.link) {
									addOpt('href', encodeURI(data.link));
								}

								if ('glossary' === data.type) {
									if (!data.glossary_id || !data.text) {
										return;
									} else {
										addOpt('glossary-id', data.glossary_id);
										if (data.disable_auto_translation) {
											addOpt('disable_auto_translation', 'true');
										}
									}
								} else if ('tooltip' === data.type) {
									if (!data.tooltip_content || !data.text) {
										return;
									} else {
										addOpt('tooltip-content', escapeContent ? data.tooltip_content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : data.tooltip_content, true);
									}
								} else if ('mediatip' === data.type) {
									if (!data.mediatip_type || !data.mediatip_content || !data.text) {
										return;
									} else {
										addOpt('mediatip-type', data.mediatip_type);
										addOpt('mediatip-content', data.mediatip_content, true);
										if (data.mediatip_caption) {
											addOpt('mediatip-caption', data.mediatip_caption, true);
										}
									}
								}
								var finalContent = '[' + shortcode + ' ' + optsStrs.join(' ') + ']' + data.text + '[/' + shortcode + ']' + tail;
								itge.log('Final content:', finalContent);
								return callback(finalContent, mode);
							};
						}();
					},
					error: function error() {
						loader.remove();
						itge.error('Error while getting TinyMCE form for Tip: ', arguments);
					}
				});
			}
		};

		function generateSelObject() {
			var txtarea = $('#content').get(0);
			var sel = {
				html: itge.replaceShortcodes(txtarea.value.substring(txtarea.selectionStart, txtarea.selectionEnd))
			};
			sel.DOM = $.parseHTML(sel.html);
			sel.start = $(sel.DOM).first().get(0);
			sel.end = $(sel.DOM).last().get(0);
			return sel;
		}
		function generateAttr(label, value, specEncode) {
			value = String(value).trim();
			if (!label.match(/^[\w_\-]*$/)) {
				return null;
			}
			return stripQuotes(label.trim(), true) + '="' + (!isNA(specEncode) && specEncode ? value.replace(/"/g, '&aquot;').replace(/\n/g, '<br/>') : stripQuotes(value, true)) + '"';
		}
		QTags.addButton('ithoughts_tt_gl-tip', 'ITG Tip', function onClickButton() {
			itge.editorForms.tip(generateSelObject(), QTags.insertContent, true);
		});
		QTags.addButton('ithoughts_tt_gl-list', 'ITG List', function onClickButton() {
			itge.editorForms.list(generateSelObject(), QTags.insertContent, true);
		});
	});
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-editor.js.map
