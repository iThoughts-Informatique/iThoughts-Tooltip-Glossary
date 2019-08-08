import QTags from '@wordpress/qtags';

import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { _throw, ETipType, lazyEval } from '@ithoughts/tooltip-glossary/common';
import { find } from 'iter-tools';
import { shortcodesTypesRegistry } from '../../../shortcode-types-registry';
import { EShortcodeFormat, IBatchShortcodeResult, ShortcodeType } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { shortcodeTypes } from '../shortcode-type';
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
		const overCursorSearchResult = find(
			( { shortcodeSearchResult } ) => shortcodeSearchResult.start < start && shortcodeSearchResult.end > start,
			allShortcodes );

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

/**
 * @see https://jbworld.com/customize-wordpress-text-editor/ really nice article to explain how QTags API works
 * @see https://github.com/iThoughts-Informatique/iThoughts-Tooltip-Glossary/blob/b18ef088ea7ae70b74c87a19f77ad652cc95dfcc/js/src/ithoughts_tt_gl-editor.js#L686-L691
 */
export const plugin = () => {
	QTags.addButton(
		ns( 'tip' ),
		'Tooltip',
		() => onClickQTagsButton( ETipType.Tooltip ),
		undefined,
		'Insert or edit a tooltip',
	);
};
