import QTags from '@wordpress/qtags';

import { CSS_NAMESPACE, ECharEscapeSet, ns, unescapeString } from '@ithoughts/tooltip-glossary/back/common';
import { _throw, AttrsHash, ETipType, ITag, lazyEval, makeHtmlElement } from '@ithoughts/tooltip-glossary/common';
import { find } from 'iter-tools';
import { isString } from 'underscore';
import { ITip, TipForm, TipFormOutput, TipFormProps } from '../../../forms';
import { IBatchShortcodeResult, ShortcodeType } from '../../common/shortcode-type';
import { shortcodeTypes } from '../shortcode-type';
import { QTagsShortcode } from '../shortcode-type/qtags-shortcode';

const txtareaLazy = lazyEval( () => {
	const t = document.getElementById( 'content' );
	if ( !( t instanceof HTMLTextAreaElement ) ) {
		throw new TypeError( 'Unexpected #content type' );
	}
	return t;
} );

/**
 * @see https://jbworld.com/customize-wordpress-text-editor/ really nice article to explain how QTags API works
 * @see https://github.com/iThoughts-Informatique/iThoughts-Tooltip-Glossary/blob/b18ef088ea7ae70b74c87a19f77ad652cc95dfcc/js/src/ithoughts_tt_gl-editor.js#L686-L691
 */

const generateSelObject = () => {
	const txtarea = txtareaLazy.val;
	const selectedText = txtarea.value.substring( txtarea.selectionStart, txtarea.selectionEnd );
	return {
		DOM: makeHtmlElement( { tag: 'div', content: selectedText } ),
		html: selectedText,
	};
};

export const loadAttributesFromString = ( qtagString: string ): TipFormOutput => {
	const { attributes, content } = { ...QTagsShortcode.fromString( qtagString ), attributes: {} as AttrsHash };
	if ( !isString( attributes.class ) ) {
		throw new Error();
	}

	const classes = attributes.class.split( ' ' );
	if ( classes.includes( `${CSS_NAMESPACE}-${ETipType.Tooltip}` ) ) {
		return {
			content: attributes.content as string,
			linkTarget: attributes.href as string,
			text: qtagString || '',
			type: ETipType.Tooltip,
		};
	} else if ( classes.includes( `${CSS_NAMESPACE}-${ETipType.Glossarytip}` ) ) {
		return {
			linkTarget: attributes.href as string,
			termId: attributes.termId as number,
			text: qtagString || '',
			type: ETipType.Glossarytip,
		};
	} else {
		throw new SyntaxError( `Could not determine the tip kind from the class list "${attributes.class}". The HTML markup may be corrupted.` );
	}
};

// export const findShortcodeToLoad = ( textarea: HTMLTextAreaElement ): IBatchShortcodeResult<QTagsShortcode> | undefined => {
// 	const [start, end] = [textarea.selectionStart, textarea.selectionEnd];

// 	// If nothing is selected...
// 	if ( start === end ) {
// 		// Get all shortcodes
// 		const allShortcodes = ShortcodeType.getAllShortcodes( shortcodeTypes, textarea.value );
// 		// Find the shortcode under the cursor
// 		const overCursorSearchResult = find(
// 			( { shortcodeSearchResult } ) => shortcodeSearchResult.start < start && shortcodeSearchResult.end > start,
// 			allShortcodes );
// 		console.log( 'Over cursor', [start, end], overCursorSearchResult );

// 		return overCursorSearchResult;
// 	} else {
// 		// TODO
// 		throw new Error( 'Not implemented' );
// 	}
// };

export const loadFromSelection = ( shortcodeToLoad: IBatchShortcodeResult<QTagsShortcode>, expectedType: ETipType ): TipFormProps => {
	// Check that the type is correct.
	const loadedType = shortcodeToLoad.type.id.replace( /^.*\/(\w+)$/, '$1' );
	if ( loadedType !== expectedType ) {
		throw new TypeError( `Expected a tip of type ${expectedType}, but got ${loadedType}` );
	}

	const tag = shortcodeToLoad.shortcodeSearchResult.tag;

	if ( expectedType === ETipType.Glossarytip ) {
		return {
			termId: tag.attributes && typeof tag.attributes.termId === 'number' ?
				tag.attributes.termId : _throw( new Error( 'Missing required attribute `termId' ) ),
			text: tag.content || '',
			type: expectedType,
		};
	} else if ( expectedType === ETipType.Tooltip ) {
		return {
			content: unescapeString(
				tag.attributes && typeof tag.attributes.content === 'string' ?
					tag.attributes.content : _throw( new Error( 'Missing required attribute `content' ) ),
				ECharEscapeSet.Html ),
			text: tag.content || '',
			type: expectedType,
		};
	}

	throw new Error( 'Unhandled case' );
};

export const getDefaultContent = ( textarea: HTMLTextAreaElement, expectedType: ETipType ) => {
	// Use default content
	const selection = textarea.value.slice( textarea.selectionStart, textarea.selectionEnd );
	if ( expectedType === ETipType.Glossarytip ) {
		return {
			termId: 0,
			text: selection,
			type: expectedType,
		};
	} else if ( expectedType === ETipType.Tooltip ) {
		return {
			content: '',
			text: selection,
			type: expectedType,
		};
	}

	throw new Error( 'Unhandled case' );
};

export const plugin = () => {
	// console.log( ns( 'tip', '-' ), QTags.addButton(
	// 	ns( 'tip' ),
	// 	'Tip',
	// 	() => {
	// 		const shortcodeToLoad = findShortcodeToLoad( txtareaLazy.val );

	// 		// Change selection to grab the whole shortcode if some is loaded.
	// 		const doChangeSelection = shortcodeToLoad ?
	// 			() => {
	// 				txtareaLazy.val.focus()
	// 				txtareaLazy.val.setSelectionRange()
	// 			}
	// 		if(shortcodeToLoad){

	// 			} else {

	// 			}
	// 		TipForm.mount( {
	// 			...loadFromSelection( txtareaLazy.val, ETipType.Tooltip ),

	// 			onClose: ( isSubmit: boolean, data?: TipFormOutput ) => {
	// 				if ( overCursorSearchResult ) {
	// 					textarea.selectionStart = overCursorSearchResult.shortcodeSearchResult.start;
	// 					textarea.selectionEnd = overCursorSearchResult.shortcodeSearchResult.end;
	// 				}
	// 				console.log( { isSubmit, data } );
	// 			},
	// 		} );
	// 		// itge.editorForms.tip( generateSelObject(), QTags.insertContent, true );
	// 	},
	// 	undefined,
	// 	undefined/* TODO */,
	// ) );
/*	QTags.addButton( 'ithoughts_tt_gl-list', 'ITG List', function onClickButton() {
		itge.editorForms.list( generateSelObject(), QTags.insertContent, true );
	} );*/
};
