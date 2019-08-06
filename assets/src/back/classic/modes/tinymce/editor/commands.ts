import { Editor } from 'tinymce';

import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';
import { initTooltip } from '@ithoughts/tooltip-glossary/front';

import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { shortcodeTypes } from '..//shortcode-type';
import { TinyMCEShortcode } from '../shortcode-type/tinymce-shortcode';
import { getEditorTip, getEditorTipUnderCursor } from './utils';

export const onOpenTipForm = async ( editor: Editor, tipType: ETipType ) => {
	// Get the element to select & convert it to a shortcode.
	const tipHtmlElement = getEditorTipUnderCursor( editor );
	const shortcode = tipHtmlElement ? TinyMCEShortcode.fromHtmlElement( tipHtmlElement ) : undefined;

	const type = shortcodeTypes.filter( ( t ): t is ShortcodeTypeTip<TinyMCEShortcode> => t instanceof ShortcodeTypeTip )
		.find( t => t.id === tipType );
	if ( !type ) {
		throw new Error( `Type ${tipType} form is not yet implemented` );
	}

	const newShortcode = await type.doPromptForm( shortcode );
	editor.execCommand( ns( 'insert-tip' ), undefined, newShortcode, newShortcode );
};

//
export function onInsertTip( editor: Editor, getTipsContainer: () => HTMLElement, _: any, tipDesc?: TinyMCEShortcode ) {
	console.log( arguments );
	console.log( tipDesc );
	if ( !tipDesc ) {
		return;
	}
	// If the returned shortcode has no UUID, then we have a problem...
	if ( !tipDesc.attributes || !tipDesc.attributes.tipUuid || typeof tipDesc.attributes.tipUuid !== 'string' ) {
		throw new Error( 'Missing UUID' );
	}

	// Try to expand selectio if on tip.
	const currentTip = getEditorTipUnderCursor( editor );
	if ( currentTip ) {
		editor.selection.select( currentTip );
	}

	editor.execCommand( 'mceReplaceContent', false, tipDesc.toString() );

	const newTip = getEditorTip( editor, tipDesc.attributes.tipUuid );
	initTooltip( newTip, getTipsContainer() );

	return true;
}

export const registerCommands = ( editor: Editor, getTipsContainer: () => HTMLElement ) => {
	editor.addCommand( ns( 'insert-tip' ), onInsertTip.bind( undefined, editor, getTipsContainer ) as any );

	editor.addCommand( ns( 'open-tooltip-form' ), onOpenTipForm.bind( undefined, editor, ETipType.Tooltip ) as any );
	editor.addCommand( ns( 'open-glossarytip-form' ), onOpenTipForm.bind( undefined, editor, ETipType.Glossarytip ) as any );
};
