import QTags from '@wordpress/qtags';

import { ensureArray, ns } from '@ithoughts/tooltip-glossary/back/common';
import { _throw, ETipType, lazyEval } from '@ithoughts/tooltip-glossary/common';
import { find } from 'iter-tools';
import { shortcodesTypesRegistry } from '../../../shortcode-types-registry';
import { EShortcodeFormat, IBatchShortcodeResult, ShortcodeType } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { shortcodeTags, shortcodeTypes } from '../shortcode-type';
import { QTagsShortcode } from '../shortcode-type/qtags-shortcode';

const txtareaLazy = lazyEval( () => {
	const t = document.getElementById( 'content' );
	if ( !( t instanceof HTMLTextAreaElement ) ) {
		throw new TypeError( 'Unexpected #content type' );
	}
	return t;
} );

export const findShortcodeToLoad = ( textarea: HTMLTextAreaElement ): IBatchShortcodeResult<QTagsShortcode> | undefined => {
	const [start, end] = [textarea.selectionStart, textarea.selectionEnd];

	// If nothing is selected...
	if ( start === end ) {
		// Get all shortcodes
		const allShortcodes = ShortcodeType.getAllShortcodes( shortcodeTypes, textarea.value );
		// Find the shortcode under the cursor
		const overCursorSearchResult = find( ( { shortcodeSearchResult: sr } ) => sr.start < start && sr.end > start, allShortcodes );

		return overCursorSearchResult;
	} else {
		// TODO
		throw new Error( 'Not implemented' );
	}
};

export const onClickQTagsButton = async ( tipType: ETipType ) => {
	const textarea = txtareaLazy.val;
	const shortcodeToLoad = findShortcodeToLoad( textarea );

	const type = shortcodesTypesRegistry.getType( tipType, EShortcodeFormat.QTags );
	if ( !( type instanceof ShortcodeTypeTip && type.managesFormatFactory( QTagsShortcode ) ) ) {
		throw new Error( `Type ${tipType} do not handle form yet.` );
	}

	const formResult = await type.doPromptForm( shortcodeToLoad ? shortcodeToLoad.shortcodeSearchResult.tag : undefined ) as QTagsShortcode | undefined;

	if ( !formResult ) {
		return;
	}

	// Change selection to grab the whole shortcode if some is loaded.
	if ( shortcodeToLoad ) {
		textarea.focus();
		textarea.setSelectionRange( shortcodeToLoad.shortcodeSearchResult.start, shortcodeToLoad.shortcodeSearchResult.end );
	}

	// Finally, insert the content. It may replace existing content.
	QTags.insertContent( formResult.toString() );
};

const registerButton = async ( id: string, label: string, onClick: () => void, title: string ) => new Promise<HTMLInputElement>( ( res, rej ) => {
	const fullId = ns( id, '-' );
	QTags.addButton( fullId, label, onClick, undefined, title );
	const qtagBtnId = 'qt_content_'.concat( fullId );
	setTimeout( () => {
		const button = document.getElementById( qtagBtnId );

		if ( !( button instanceof HTMLInputElement ) ) {
			return rej( new Error( 'Could not get the created button' ) );
		}

		return res( button );
	} );
} );

const onCursorMove = ( textarea: HTMLTextAreaElement, callback: () => void ) => {
	let prevPos = textarea.selectionStart;

	const eventListener = () => {
		const newPos = textarea.selectionStart;

		if ( newPos !== prevPos ) {
			prevPos = newPos;
			callback();
		}
	};

	textarea.addEventListener( 'click', eventListener );
	textarea.addEventListener( 'keyup', eventListener );
};

/**
 * @see https://jbworld.com/customize-wordpress-text-editor/ really nice article to explain how QTags API works
 * @see https://github.com/iThoughts-Informatique/iThoughts-Tooltip-Glossary/blob/b18ef088ea7ae70b74c87a19f77ad652cc95dfcc/js/src/ithoughts_tt_gl-editor.js#L686-L691
 */
export const plugin = async () => {
	const [addTooltip, addGlossarytip, removeTip] = await Promise.all( [
		registerButton( ETipType.Tooltip, 'Tooltip', () => onClickQTagsButton( ETipType.Tooltip ), 'Insert or edit a tooltip' ),
		registerButton( ETipType.Glossarytip, 'Glossary tip', () => onClickQTagsButton( ETipType.Glossarytip ), 'Insert or edit a glossary tip' ),
		registerButton( 'remove-tip', 'Remove tip', () => {}, 'Remove a tip' ),
	] );

	if ( !QTags.instances.content ) {
		throw new Error( 'Could not get the `content` QTag container' );
	}
	const textarea = QTags.instances.content.canvas;

	const tipsShortcodesTags = Object.values( shortcodeTags ).flatMap( v => v );
	const tagsRegex = new RegExp( `\\[(${tipsShortcodesTags.join( '|' )})[^\\]]*\\](?!.*?\\[\\/\\1\\])` );
	console.log( { tagsRegex } );
	onCursorMove( textarea, () => {
		addTooltip.disabled = false;
		addGlossarytip.disabled = false;
		removeTip.disabled = true;

		const pos = textarea.selectionStart;

		// Find shortcode components bounds
		const textareaContent = textarea.value;
		const closestOpen = textareaContent.lastIndexOf( '[', pos - 1 );
		const closestClose = textareaContent.indexOf( ']', pos );

		if ( closestOpen === -1 || closestClose === -1 ) {
			return;
		}

		// Get the shortcode part
		const inBetween = textareaContent.slice( closestOpen, closestClose + 1 );
		// Extract the tag. To avoid [/foo]bar[qux] matches, use 2 different regexes
		const tagMatch = inBetween.match( /^\[\/(\w+)\]$/ ) || inBetween.match( /^\[(\w+)/ );
		if ( !tagMatch ) {
			return;
		}
		const tag = tagMatch[1];

		// Get the shortcode type (and see if this plugin is relevant)
		const typePair = Object.entries( shortcodeTags )
			.find( ( [, tags] ) => ensureArray( tags ).includes( tag ) );
		if ( !typePair ) {
			return;
		}
		const type = typePair[0] as ETipType;

		// Enable/disable the correct button
		switch ( type ) {
			case ETipType.Glossarytip: {
				addTooltip.disabled = true;
				addGlossarytip.disabled = false;
				removeTip.disabled = false;
			}                          break;

			case ETipType.Tooltip: {
				addGlossarytip.disabled = true;
				addTooltip.disabled = false;
				removeTip.disabled = false;
			}                      break;
		}
	} );
};
