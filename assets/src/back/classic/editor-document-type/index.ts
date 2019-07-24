import { CSS_NAMESPACE, uuid } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, ITag } from '@ithoughts/tooltip-glossary/common';

import { baseTipClass } from '../utils';
import { EditorDocumentType } from './editor-document-type';
import { EShortcodeFormat, ShortcodeTransformer, ShortcodeType, TCastShortcodeTransform } from './shortcode-type';

export { EditorDocumentType };

const toggleTipUuid: ShortcodeTransformer<ITag> = ( shortcode, from, to ) => {
	if ( from === EShortcodeFormat.TinyMCE && shortcode.attributes ) {
		delete shortcode.attributes.tipUuid;
	} else if ( from === EShortcodeFormat.QTags ) {
		shortcode.attributes = {
			...shortcode.attributes,
			tipUuid: uuid( 'tip' ),
		};
	}
	return shortcode;
};
const toggleClass: ( classesToRemove: string[] ) => ShortcodeTransformer<ITag> = ( classesToToggle: string[] ) => ( shortcode, from, to ) => {
	if ( from === EShortcodeFormat.TinyMCE && shortcode.attributes && typeof shortcode.attributes.class === 'string' ) {
		const classes = shortcode.attributes.class.split( /\s+/g );
		shortcode.attributes.class = classes
			.filter( c => !classesToToggle.includes( c ) )
			.join( ' ' ) || undefined;
	} else if ( from === EShortcodeFormat.QTags ) {
		// Try to reuse existing `class` if it exists.
		const classes = shortcode.attributes && typeof shortcode.attributes.class !== 'undefined' ?
			String( shortcode.attributes.class ).split( /\s+/g ) :
			[];
		shortcode.attributes = {
			...shortcode.attributes,
			class: classesToToggle.concat( classes ).join( ' ' ),
		};
	}
	return shortcode;
};

export const editorDocumentType = new EditorDocumentType( [
	new ShortcodeType(
		{ tag: ['glossary', 'itg-glossary'], attributes: { tipType: undefined }},
		{ tag: 'a', attributes: { tipType: ETipType.Glossarytip }},
		[ toggleTipUuid, toggleClass( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}`] ) ],
	),

	new ShortcodeType(
		{ tag: ['tooltip', 'itg-tooltip'], attributes: { tipType: undefined }},
		{ tag: 'a', attributes: { tipType: ETipType.Tooltip }},
		[ toggleTipUuid, toggleClass( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}`] ) ],
	),

	new ShortcodeType(
		{ tag: ['glossary_term_list', 'itg-column-list'], attributes: { tipListType: undefined }},
		{ tag: 'span', attributes: { tipListType: 'ithoughts-tooltip-glossary-column-list' }},
	),
	new ShortcodeType(
		{ tag: ['glossary_atoz', 'itg-paged-list'], attributes: { tipListType: undefined }},
		{ tag: 'span', attributes: { tipListType: 'ithoughts-tooltip-glossary-paged' }},
	),
] );
