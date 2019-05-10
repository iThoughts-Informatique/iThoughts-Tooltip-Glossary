import tinymce, { Editor } from 'tinymce';

import { camelCaseToDash, iconSvg, makeHtmlTag, ns } from '@ithoughts/tooltip-glossary/back/common';
import editorConfig from '~editor-config';

import { ETipType, TipForm, TipFormOutput } from './forms';
import { isGlossarytip } from './forms/tip-form/glossarytip-section';
import { isTooltip } from './forms/tip-form/tooltip-section';

import './tinymce-plugin.scss';

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
			href: `/term-${tipDesc.termId}`,
			termId: tipDesc.termId.toString(),
		} as const;
	} else if ( isTooltip( tipDesc ) ) {
		return {
			content: tipDesc.content,
		} as const;
	} else {
		throw new Error();
	}
};

tinymce.PluginManager.add( 'ithoughts-tooltip-glossary', editor => {
	// Avoid issue with rollup-plugin-json-manifest
	const editorStylesheetUrl = editorConfig.manifest['back-editor-classic' + '.css'];
	if ( editorStylesheetUrl ) {
		editor.contentCSS.push( editorStylesheetUrl );
	}

	editor.addCommand( ns( 'insert-tip' ), ( ( ui, tipDesc: TipFormOutput ) => {
		console.log( ns( 'insert-tip' ), { ui, value: tipDesc } );

		const typeName = ETipType[tipDesc.type];
		const attributes = {
			class: [ns( camelCaseToDash( typeName ), '-' ), ns( 'tip', '-' )].join( ' ' ),
			href: tipDesc.linkTarget,
			text: tipDesc.text,
			type: typeName,

			...getSpecializedAttributes( tipDesc ),
		};

		const tag = makeHtmlTag( { tag: 'a', content: tipDesc.text, attributes } );
		console.log( tag );
		editor.execCommand(
			'mceReplaceContent',
			false,
			tag.outerHTML,
		);
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

	// Add a button that opens a window
	editor.addButton( ns( 'add-tooltip' ), {
		image: iconSvg,
		title: 'Add a tooltip',

		cmd: ns( 'open-tooltip-form' ),
	} );
	// Add the equivalent delete button
	editor.addButton( ns( 'add-glossarytip' ), {
		image: iconSvg,
		title: 'Add a glossary tip',

		cmd: ns( 'open-glossarytip-form' ),
	} );

	editor.addButton( ns( 'remove-tip' ), {
		image: iconSvg,
		title: 'Remove a tip',

		onclick: () => {
			console.log( 'triggered' );
		},
	} );

	editor.addButton( ns( 'add-list' ), {
		image: iconSvg,
		title: 'Add a glossary list',

		onclick: () => {
			console.log( 'triggered' );
		},
	} );
} );
