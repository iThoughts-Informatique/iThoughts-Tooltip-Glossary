import { EShortcodeFormat } from '../common/shortcode-type';
import { IClassicPlugin } from '../types';
import { plugin } from './editor';
import { shortcodeTypes } from './shortcode-type';
import { QTagsShortcode } from './shortcode-type/qtags-shortcode';

export const qtagsPlugin: IClassicPlugin<QTagsShortcode> = {
	bootstrap() {
		plugin();
	},
	shortcodeTypes,
	type: EShortcodeFormat.QTags,
};
