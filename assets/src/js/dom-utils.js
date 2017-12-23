'use strict';

const ithoughts = iThoughts.v5;
const itge      = iThoughtsTooltipGlossaryEditor;

const {
	$
} = ithoughts;

// ##### `initTab`: Set up a tab switcher element
/**
 * @function initTab
 * @description Set up a tab switcher element
 * @author Gerkin
 * @param {jQuery} $tabs jQuery selector containing the tabs triggers
 * @param {Function} [cb] Function to execute with cb( newIndex )
 * @returns {undefined}
 */
const initTab = ( $tabs, cb ) => {
	$tabs.click( function onClick() {
		const $this = $( this );
		// First, clean the `active` class on all siblings, then set it only on event emitter
		$this.parent().find( '.active' ).removeClass( 'active' );
		$this.addClass( 'active' );

		// Then, we check the index of the clicked element (`this`) in the parent, and we set active the tab with the same index
		const index = $this.index();
		$this.parent().parent().find( ' > .active' ).removeClass( 'active' );
		$( $this.parent().parent().children()[index + 1]).addClass( 'active' );

		// Then we try to call the callback (if set)
		cb && cb( index );
	});
	// Self-set
	$tabs.filter( '.active' ).click();
};

const initTinymceEditors = $editors => {
	// Initialize the TinyMCE editor inside the Tooltip tab
	$editors.each( ( index, editor ) => {
		// Find a free id. If our editor does not have an ID, we have to generate one
		while ( null == editor.getAttribute( 'id' )) {
			const newId = `editor${  Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 10 ) }`;
			// If this editor ID is free, then set it. Else, loop using the parent `while`
			if ( 0 === $( newId ).length ) {
				editor.setAttribute( 'id', newId );
			}
		}
		const editorId = editor.getAttribute( 'id' );
		// Save the current text in the not-yet-TinyMCE editor. It will be used later to restore the content
		const text = editor.value;
		// Do effective call to tinymce & init the editor
		tinymce.init({
			selector:         `#${  editorId }`,
			menubar:          false,
			external_plugins: {
				code:      `${ itge.base_assets }/deps/tinymce/code/plugin.min.js`,
				wordcount: `${ itge.base_assets }/deps/tinymce/wordcount/plugin.min.js`,
			},
			plugins: 'wplink',
			toolbar: [
				'styleselect | bold italic underline link | bullist numlist | alignleft aligncenter alignright alignjustify | code',
			],
			min_height: 70,
			height:     70,
			resize:     false,
		});
		// **Restore the content**
		let intervalContent = setInterval( () => {
			const subeditor = tinymce.get( editorId );
			// Check if the subeditor is fully initialized. If that's the case, set its content & clear interval
			if ( subeditor && subeditor.getDoc() && subeditor.getBody()) {
				itg.log( 'Initing subeditor with content ', JSON.stringify( text ));
				clearInterval( intervalContent );
				subeditor.setContent( text.replace( /&/g, '&amp;' ));
			}
		}, 50 );
	});
};

// ##### `removeEditor`: Clean an editor
/**
 * @function removeEditor
 * @description Clean an editor
 * @author gerkin
 * @param   {String} editorId Id of the editor to delete
 * @returns {undefined}
 */
function removeTinymceEditor( editorId ) {
	// Sometimes (depending on the browser AFAIK), TinyMCE fails to execute the command to remove an editor. We then have to clean its data manually
	try {
		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, editorId );
	} catch ( e ) {
		iThoughtsTooltipGlossary.warn( 'Force cleaning needed: ', e );
		tinymce.EditorManager.editors = tinymce.EditorManager.editors.filter( function findEditor( editor ) {
			return editor.id !== editorId;
		});
	}
};

module.exports = {
	initTab,
	tinymce: {
		init: initTinymceEditors,
		remove: removeTinymceEditor,
	},
};