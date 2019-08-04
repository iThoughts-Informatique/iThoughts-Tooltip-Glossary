import { CSS_NAMESPACE, ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { addClasses, addTipType, addTipUuid, removeClasses, removeTipType, removeTipUuid } from '../../shortcode-transformers';
import { ShortcodeType } from '../../shortcode-type';
import { baseTipClass } from '../editor/utils';
import { TinyMCEShortcode } from './tinymce-shortcode';

const shortcodeTypeFactory = ShortcodeType.createFactory( TinyMCEShortcode );
export const shortcodeTypes = [
	shortcodeTypeFactory(
		ns( ETipType.Glossarytip ),
		{ tag: 'a', attributes: { tipType: ETipType.Glossarytip }},
		{
			from: [removeTipUuid, removeTipType, removeClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}`] )],
			to: [addTipUuid, addTipType( ETipType.Glossarytip ), addClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}`] ), ShortcodeType.wrapShortcodeOverride( { tag: 'a' } )],
		},
	),

	shortcodeTypeFactory(
		ns( ETipType.Tooltip ),
		{ tag: 'a', attributes: { tipType: ETipType.Tooltip }},
		{
			from: [removeTipUuid, removeTipType, removeClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}`] )],
			to: [addTipUuid, addTipType( ETipType.Tooltip ), addClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}`] ), ShortcodeType.wrapShortcodeOverride( { tag: 'a' } )],
		},
	),

	shortcodeTypeFactory(
		ns( 'glossary-term-list' ),
		{ tag: 'span', attributes: { tipListType: 'column-list' }},
	),
	shortcodeTypeFactory(
		ns( 'glossary-atoz' ),
		{ tag: 'span', attributes: { tipListType: 'column-paged' }},
	),
];
