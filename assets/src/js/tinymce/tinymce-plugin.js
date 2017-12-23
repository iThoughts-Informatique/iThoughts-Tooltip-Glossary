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

const utils     = require( './tinymce-utils' );
const filters   = require( './tinymce-filters' );
const formHandler = require('./form-handler');

const ithoughts = iThoughts.v5;
const itg       = iThoughtsTooltipGlossary;
const itge      = iThoughtsTooltipGlossaryEditor;

/* global tinymce:false, iThoughts: false, iThoughtsTooltipGlossary: false, iThoughtsTooltipGlossaryEditor: false */

const $            = ithoughts.$;

const setToggleable = ( element, editor ) => {
	return function setToggleState() {
		editor.on( element, event => {
			this.active( event.active );
		});
	};
};


$.extend( itge, {
	replaceShortcodes( content ) {
		itge.replaceShortcodesEl.forEach( filter => content = filter( content ));
		return content;
	},
	restoreShortcodes( content ) {
		itge.restoreShortcodesEl.forEach( filter => content = filter( content ));
		return content;
	},
	replaceShortcodesEl: [
		filters.replace.tip,
		filters.replace.list,
	],
	restoreShortcodesEl: [
		filters.restore.tip,
		filters.restore.list,
	],
});

tinymce.PluginManager.add( 'ithoughts_tt_gl_tinymce', editor => {
	itge.editor = editor;

	//CSS
	editor.contentCSS.push( `${ itg.baseurl }/assets/dist/css/ithoughts_tt_gl-admin.min.css?v=2.7.0` );
	/*

		function getLang(str) {
			editor.getLang(prefix2 + str);
		}
*/

	editor
	// Replace shortcodes with DOM
		.on( 'BeforeSetcontent', event => event.content = itge.replaceShortcodes( event.content ))
	// Replace DOM with shortcodes
		.on( 'GetContent', event => event.content = itge.restoreShortcodes( event.content ))
	// When moving the cursor
		.on( 'NodeChange', event => {
		// Get the new element under the cursor
			const element = event.element;
			// If it is into a tooltip shortcode, set buttons state to active...
			if ( $( element ).closest( utils.tipsSelector ).length > 0 ) {
				editor.fire( 'glossaryterm', { active: true });
				editor.fire( 'glossaryterm-d', { active: true });
			// ...Else, disable them
			} else {
				editor.fire( 'glossaryterm', { active: false });
				editor.fire( 'glossaryterm-d', { active: false });
			}
			// Set the list button depending on the attribute `data-type`
			const isInList = [ 'ithoughts-tooltip-glossary-term_list', 'ithoughts-tooltip-glossary-atoz' ].includes( element.getAttribute( 'data-type' ));
			editor.fire( 'glossarylist', { active: isInList });
		});

	const insertInTinyMCE = ( shortcode, mode ) => {
		// Insert content when the window form is submitted
		if ( 'load' === mode ) {
			editor.selection.select( editor.selection.getStart());
		} else if ( mode.indexOf( 'extend' ) > -1 ) {
			itg.error( 'Unhandled mode "extend" during writing of new tooltip shortcode' );
		}
		editor.insertContent( shortcode );
	};

	// ### Tooltip buttons
	editor.addButton( 'glossaryterm', {
		title:        editor.getLang( 'ithoughts_tt_gl_tinymce.add_tooltip' ),
		image:        `${ itge.base_assets }/dist/imgs/glossaryterm.png`,
		onPostRender: setToggleable( 'glossaryterm', editor ),
		onclick:      async() => {
			const result = await utils.editorForms.tip( utils.generateSelObject( editor ));
			insertInTinyMCE( result.finalContent, result.mode );
		},
	});
	QTags.addButton( 'ithoughts_tt_gl-tip', 'ITG Tip', async() => {
		const result = await utils.editorForms.tip( utils.generateSelObject());
		QTags.insertContent( result.finalContent );
	});
	// #### Delete tooltip button
	editor.addButton( 'glossaryterm-d', {
		title:        editor.getLang( 'ithoughts_tt_gl_tinymce.remove_tooltip' ),
		image:        `${ itge.base_assets }/dist/imgs/glossaryterm-d.png`,
		onPostRender: setToggleable( 'glossaryterm-d', editor ),
		onclick:      () => {
			const $currentNode = $( editor.selection.getNode());
			// Get the selected node
			const $node = $currentNode.closest( utils.tipsSelector );
			const node = $node.get( 0 );
			if ( !node ) {
				return;
			}
			$node.replaceWith( node.innerHTML );
		},
	});

	// ### List button
	editor.addButton( 'glossarylist', {
		title:        editor.getLang( 'ithoughts_tt_gl_tinymce.add_index' ),
		image:        `${ itge.base_assets }/dist/imgs/glossaryindex.png`,
		onPostRender: setToggleable( 'glossarylist', editor ),
		onclick:      async() => {
			const result = await utils.editorForms.list( utils.generateSelObject( editor ));
			insertInTinyMCE( result.finalContent, result.mode );
		},
	});
	QTags.addButton( 'ithoughts_tt_gl-list', 'ITG List', async() => {
		const result = await utils.editorForms.list( utils.generateSelObject(), true );
		QTags.insertContent( result.finalContent );
	});
});
