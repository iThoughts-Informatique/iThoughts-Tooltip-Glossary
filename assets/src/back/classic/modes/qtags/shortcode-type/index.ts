import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { ShortcodeType } from '../../common/shortcode-type';
import { ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { qTagsTipFormLoader } from './form-loader';
import { QTagsShortcode } from './qtags-shortcode';

export const shortcodeTypes = [
	new ShortcodeTypeTip(
		ETipType.Glossarytip,
		{ tag: ['glossary', 'glossarytip'] },
		QTagsShortcode,
		qTagsTipFormLoader,
		{
			to: [ShortcodeType.wrapShortcodeOverride( { tag: 'glossary' } )],
		},
	),

	new ShortcodeTypeTip(
		ETipType.Tooltip,
		{ tag: 'tooltip' },
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
