import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { ShortcodeType } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { qTagsTipFormLoader } from './form-loader';
import { QTagsShortcode } from './qtags-shortcode';

export const shortcodeTags = {
	[ETipType.Glossarytip]: ['glossary', 'glossarytip'],
	[ETipType.Tooltip]: 'tooltip',
};
export const shortcodeTypes = [
	new ShortcodeTypeTip(
		ETipType.Glossarytip,
		{ tag: shortcodeTags[ETipType.Glossarytip] },
		QTagsShortcode,
		qTagsTipFormLoader,
		{
			to: [ShortcodeType.wrapShortcodeOverride( { tag: 'glossary' } )],
		},
	),

	new ShortcodeTypeTip(
		ETipType.Tooltip,
		{ tag: shortcodeTags[ETipType.Tooltip] },
		QTagsShortcode,
		qTagsTipFormLoader,
		{
			to: [ShortcodeType.wrapShortcodeOverride( { tag: 'tooltip' } )],
		},
	),

	new ShortcodeType(
		ns( 'glossary-term-list' ),
		{ tag: 'span', attributes: { tipListType: 'column-list' }},
		QTagsShortcode,
	),
	new ShortcodeType(
		ns( 'glossary-atoz' ),
		{ tag: 'span', attributes: { tipListType: 'column-paged' }},
		QTagsShortcode,
	),
];
