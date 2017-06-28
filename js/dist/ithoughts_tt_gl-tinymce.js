/**
 * @file TinyMCE plugin scripts
 *
 * @author Gerkin
 * @copyright 2016 GerkinDevelopment
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.fr.html GPLv2
 * @package ithoughts-tooltip-glossary
 *
 * @version 2.7.0
 */

'use strict';

/* global tinymce:false, iThoughtsTooltipGlossaryEditor: false */

(function selfCalling(ithoughts) {
	var $ = ithoughts.$,
	    itg = iThoughtsTooltipGlossary,
	    itge = iThoughtsTooltipGlossaryEditor,
	    prefix2 = 'ithoughts_tt_gl_tinymce',
	    prefix3 = 'ithoughts-tooltip-glossary',
	    tipsTypes = ['itg-term', 'itg-tooltip', 'itg-mediatip'],
	    tipsSelector = tipsTypes.map(function wrapTypes(e) {
		return '[data-type="' + e + '"]';
	}).join(',');

	function setToggleable(element, editor) {
		return function toggle() {
			var self = this;
			editor.on(element, function setElementActive(e) {
				self.active(e.active);
			});
		};
	}

	tinymce.PluginManager.add(prefix2, function registerTinyMCEPlugin(editor) {
		//CSS
		editor.contentCSS.push(itg.baseurl + '/css/ithoughts_tt_gl-admin.min.css?v=2.7.0');
		/*
  	function getLang(str) {
  	editor.getLang(prefix2 + str);
  }
  */

		function glossarytermremovefct() {
			var currentNode = editor.selection.getNode(),
			    $currentNode = $(currentNode),
			    $node = $currentNode.closest(tipsSelector),
			    node = $node.get(0);
			if (!node) {
				return;
			}
			var html = node.innerHTML;
			$node.replaceWith(html);
		}

		editor.on('BeforeSetcontent', function beforeSetContent(event) {
			//replace from shortcode to displayable html content
			event.content = itge.replaceShortcodes(event.content);
		}).on('GetContent', function getContent(event) {
			//replace from displayable html content to shortcode
			event.content = itge.restoreShortcodes(event.content);
		}).on('NodeChange', function nodeChange(event) {
			var element = event.element;
			if ($(element).closest(tipsSelector).length > 0) {
				editor.fire('glossaryterm', {
					active: true
				});
				editor.fire('glossaryterm-d', {
					active: true
				});
			} else {
				editor.fire('glossaryterm', {
					active: false
				});
				editor.fire('glossaryterm-d', {
					active: false
				});
			}
			if ([prefix3 + '-term_list', prefix3 + '-atoz'].indexOf(element.getAttribute('data-type')) !== -1) {
				editor.fire('glossarylist', {
					active: true
				});
			} else {
				editor.fire('glossarylist', {
					active: false
				});
			}
		});

		function generateSelObject() {
			var tinymceSel = editor.selection,
			    sel = {
				DOM: $(tinymceSel.getNode()).closest(tipsSelector).toArray()
			};
			sel.html = tinymceSel.getContent({
				format: 'html'
			});
			sel.start = tinymceSel.getStart();
			sel.end = tinymceSel.getEnd();
			return sel;
		}
		function insertInTinyMCE(shortcode, mode) {
			// Insert content when the window form is submitted
			if ('load' === mode) {
				editor.selection.select(editor.selection.getStart());
			} else if (mode.indexOf('extend') > -1) {
				itge.error('Unhandled mode "extend" during writing of new tooltip shortcode');
			}
			editor.insertContent(shortcode);
		}

		// Add a button that opens a window
		editor.addButton('glossaryterm', {
			title: editor.getLang(prefix2 + '.add_tooltip'),
			image: itge.base_tinymce + '/icon/glossaryterm.png',
			onPostRender: setToggleable('glossaryterm', editor),
			onclick: function onclick() {
				itge.editorForms.tip(generateSelObject(), insertInTinyMCE);
			}
		});
		// Add the equivalent delete button
		editor.addButton('glossaryterm-d', {
			title: editor.getLang(prefix2 + '.remove_tooltip'),
			image: itge.base_tinymce + '/icon/glossaryterm-d.png',
			onPostRender: setToggleable('glossaryterm-d', editor),
			onclick: glossarytermremovefct
		});

		editor.addButton('glossarylist', {
			title: editor.getLang(prefix2 + '.add_index'),
			image: itge.base_tinymce + '/icon/glossaryindex.png',
			onPostRender: setToggleable('glossarylist', editor),
			onclick: function onclick() {
				var sel = {
					selection: editor.selection
				};
				sel.start = sel.selection.getStart();
				sel.end = sel.selection.getEnd();
				sel.DOM = $.parseHTML(sel.selection);
				itge.editorForms.list(generateSelObject(), insertInTinyMCE);
			}
		});
	});
})(iThoughts.v5);
//# sourceMappingURL=ithoughts_tt_gl-tinymce.js.map
