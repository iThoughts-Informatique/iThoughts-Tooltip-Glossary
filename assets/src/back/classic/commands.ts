import { Editor } from 'tinymce';

import { CSS_NAMESPACE, ns, uuid } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, isGlossarytip, isTooltip, makeHtmlElement, parseHtmlElement } from '@ithoughts/tooltip-glossary/common';
import { initTooltip } from '@ithoughts/tooltip-glossary/front';

import { isString } from 'underscore';
import { ITip, TipForm, TipFormOutput } from './forms';
import { baseTipClass, getClosestTipParent, getEditorTip } from './utils';

const openTipForm = ( editor: Editor, tipDesc: TipFormOutput | ITip ) => {
	const form = TipForm.mount( {
		...tipDesc,

		onClose: ( isSubmit: boolean, data?: TipFormOutput ) => {
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
export const loadAttributesFromHtmlElement = ( element: HTMLElement ): TipFormOutput => {
	const { attributes, content } = parseHtmlElement( element );
	if ( !isString( attributes.class ) ) {
		throw new Error();
	}

	const classes = attributes.class.split( ' ' );
	if ( classes.includes( `${CSS_NAMESPACE}-${ETipType.Tooltip}` ) ) {
		return {
			content: attributes.content as string,
			linkTarget: attributes.href as string,
			text: content,
			type: ETipType.Tooltip,
		};
	} else if ( classes.includes( `${CSS_NAMESPACE}-${ETipType.Glossarytip}` ) ) {
		return {
			linkTarget: attributes.href as string,
			termId: attributes.termId as number,
			text: content,
			type: ETipType.Glossarytip,
		};
	} else {
		throw new SyntaxError( `Could not determine the tip kind from the class list "${attributes.class}". The HTML markup may be corrupted.` );
	}
};

export const loadFromSelection = ( editor: Editor, expectedType: ETipType ): TipFormOutput | ITip => {
	const range = editor.selection.getRng( true );

	// Try to find the closest tip
	const triedTipParent = getClosestTipParent( range.commonAncestorContainer.parentElement );
	if ( triedTipParent ) {
		const loaded = loadAttributesFromHtmlElement( triedTipParent );
		if ( loaded.type !== expectedType ) {
			throw new TypeError( `Expected a tip of type ${expectedType}, but got ${loaded.type}` );
		}
		return loaded;
	}

	return {
		text: '',
		type: expectedType,
	};
};

export const registerCommands = ( editor: Editor, getTipsContainer: () => HTMLElement ) => {
	editor.addCommand( ns( 'insert-tip' ), ( ( _ui, tipDesc: TipFormOutput ) => {
		const typeName = ETipType[tipDesc.type];
		const attributes = {
			class: [baseTipClass, `${CSS_NAMESPACE}-${typeName}`].join( ' ' ),
			href: tipDesc.linkTarget,
			text: tipDesc.text,
			tipUuid: uuid( 'tip' ),
			type: typeName,

			...getSpecializedAttributes( tipDesc ),
		};

		// Could use editor.dom.createHTML, but our method is better ;)
		const tag = makeHtmlElement( { tag: 'a', content: tipDesc.text, attributes } );
		editor.execCommand( 'mceReplaceContent', false, tag.outerHTML );

		const newTip = getEditorTip( editor, attributes.tipUuid );
		initTooltip( newTip, getTipsContainer() );

		return true;
	} ) as ( u?: boolean, v?: any ) => boolean );

	editor.addCommand( ns( 'open-tooltip-form' ), value => {
		openTipForm( editor, loadFromSelection( editor, ETipType.Tooltip ) );
		return true;
	} );
	editor.addCommand( ns( 'open-glossarytip-form' ), value => {
		openTipForm( editor, loadFromSelection( editor, ETipType.Glossarytip ) );
		return true;
	} );
};
