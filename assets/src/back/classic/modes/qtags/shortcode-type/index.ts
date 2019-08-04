import { ns } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';

import { ShortcodeType } from '../../shortcode-type';
import { QTagsShortcode } from './qtags-shortcode';

const shortcodeTypeFactory = ShortcodeType.createFactory( QTagsShortcode );
export const shortcodeTypes = [
	shortcodeTypeFactory(
		ns( ETipType.Glossarytip ),
		{ tag: ['glossary', 'glossarytip'] },
		{
			to: [ShortcodeType.wrapShortcodeOverride( { tag: 'glossary' } )],
		},
	),

	shortcodeTypeFactory(
		ns( ETipType.Tooltip ),
		{ tag: 'tooltip' },
		{
			to: [ShortcodeType.wrapShortcodeOverride( { tag: 'tooltip' } )],
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
