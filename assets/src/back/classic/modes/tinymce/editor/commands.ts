import { Editor } from 'tinymce';

import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, initTip } from '@ithoughts/tooltip-glossary/common';

import { shortcodesTypesRegistry } from '../../../shortcode-types-registry';
import { EShortcodeFormat } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { TinyMCEShortcode } from '../shortcode-type/tinymce-shortcode';
import { getEditorTip, getEditorTipUnderCursor } from './utils';

export const onOpenTipForm = async ( editor: Editor, tipType: ETipType ) => {
	// Get the element to select & convert it to a shortcode.
	const tipHtmlElement = getEditorTipUnderCursor( editor );
	const shortcode = tipHtmlElement ? TinyMCEShortcode.fromHtmlElement( tipHtmlElement ) : undefined;

	const type = shortcodesTypesRegistry.getType( tipType, EShortcodeFormat.TinyMCE );
	if ( !( type instanceof ShortcodeTypeTip && type.managesFormatFactory( TinyMCEShortcode ) ) ) {
		throw new Error( `Type ${tipType} do not handle form yet.` );
	}

	const newShortcode = await type.doPromptForm( shortcode );
	editor.execCommand( ns( 'insert-tip' ), undefined, newShortcode, newShortcode );
};

export const onInsertTip = ( editor: Editor, getTipsContainer: () => HTMLElement, _: any, tipDesc?: TinyMCEShortcode ) => {
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
	initTip( newTip, getTipsContainer() );

	return true;
};

export const registerCommands = ( editor: Editor, getTipsContainer: () => HTMLElement ) => {
	editor.addCommand( ns( 'insert-tip' ), onInsertTip.bind( undefined, editor, getTipsContainer ) as any );

	editor.addCommand( ns( 'open-tooltip-form' ), onOpenTipForm.bind( undefined, editor, ETipType.Tooltip ) as any );
	editor.addCommand( ns( 'open-glossarytip-form' ), onOpenTipForm.bind( undefined, editor, ETipType.Glossarytip ) as any );
};
