import { CSS_NAMESPACE } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { addClasses, addTipType, addTipUuid, removeClasses, removeTipType, removeTipUuid } from '../../common/shortcode-transformers';
import { ShortcodeType } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { baseTipClass } from '../editor/utils';
import { tinyMCETipFormLoader } from './form-loader';
import { TinyMCEShortcode } from './tinymce-shortcode';

export const shortcodeTypes = [
	new ShortcodeTypeTip(
		ETipType.Glossarytip,
		{ tag: 'a', attributes: { tipType: ETipType.Glossarytip }},
		TinyMCEShortcode,
		tinyMCETipFormLoader,
		{
			from: [removeTipUuid, removeTipType, removeClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}`] )],
			to: [addTipUuid, addTipType( ETipType.Glossarytip ), addClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}`] ), ShortcodeType.wrapShortcodeOverride( { tag: 'a' } )],
		},
	),

	new ShortcodeTypeTip(
		ETipType.Tooltip,
		{ tag: 'a', attributes: { tipType: ETipType.Tooltip }},
		TinyMCEShortcode,
		tinyMCETipFormLoader,
		{
			from: [removeTipUuid, removeTipType, removeClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}`] )],
			to: [addTipUuid, addTipType( ETipType.Tooltip ), addClasses( [baseTipClass, `${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}`] ), ShortcodeType.wrapShortcodeOverride( { tag: 'a' } )],
		},
	),

	new ShortcodeType(
		'glossary-term-list',
		{ tag: 'span', attributes: { tipListType: 'column-list' }},
		TinyMCEShortcode,
	),
	new ShortcodeType(
		'glossary-atoz',
		{ tag: 'span', attributes: { tipListType: 'column-paged' }},
		TinyMCEShortcode,
	),
];
