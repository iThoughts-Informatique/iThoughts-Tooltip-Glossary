import { Editor } from 'tinymce';

import { CSS_NAMESPACE, ns, uuid } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, isGlossarytip, isTooltip, makeHtmlElement } from '@ithoughts/tooltip-glossary/common';

import { TipForm, TipFormOutput } from './forms';

const openTipForm = ( editor: Editor, type: ETipType ) => {
	const form = TipForm.mount( {
		text: '',
		type,

		onClose: ( isSubmit: boolean, data?: TipFormOutput ) => {
			console.log( isSubmit, data );
			if ( isSubmit && data ) {
				editor.execCommand( ns( 'insert-tip' ), undefined, data, data );
			}
		},
	} );
};

const getSpecializedAttributes = ( tipDesc: TipFormOutput ) => {
	if ( isGlossarytip( tipDesc ) ) {
		return {
			href:   tipDesc.linkTarget,
			termId: tipDesc.termId.toString(),
		} as const;
	} else if ( isTooltip( tipDesc ) ) {
		return {
			content: tipDesc.content,
			href:    tipDesc.linkTarget,
		} as const;
	} else {
		throw new Error();
	}
};

export const registerCommands = ( editor: Editor ) => {
	editor.addCommand( ns( 'insert-tip' ), ( ( ui, tipDesc: TipFormOutput ) => {
		const typeName = ETipType[tipDesc.type];
		const attributes = {
			class: [ typeName, 'tip' ].map( c => `${CSS_NAMESPACE}-${c}` ).join( ' ' ),
			href: tipDesc.linkTarget,
			text: tipDesc.text,
			tipUuid: uuid( 'tip' ),
			type: typeName,

			...getSpecializedAttributes( tipDesc ),
		};

		// Could use editor.dom.createHTML, but our method is better ;)
		const tag = makeHtmlElement( { tag: 'a', content: tipDesc.text, attributes } );
		editor.execCommand( 'mceReplaceContent', false, tag.outerHTML );

		const newTip = editor.getBody().querySelector( `[data-tip-uuid="${attributes.tipUuid}"]` );
		// TODO: Init new tip

		return true;
	} ) as ( u?: boolean, v?: any ) => boolean );

	editor.addCommand( ns( 'open-tooltip-form' ), ( ui, value ) => {
		openTipForm( editor, ETipType.Tooltip );
		return true;
	} );
	editor.addCommand( ns( 'open-glossarytip-form' ), ( ui, value ) => {
		openTipForm( editor, ETipType.Glossarytip );
		return true;
	} );
};
