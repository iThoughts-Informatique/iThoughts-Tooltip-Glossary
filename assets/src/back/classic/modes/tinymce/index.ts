import tinymce from 'tinymce';

import { ns } from '@ithoughts/tooltip-glossary/back/common';

import { EShortcodeType } from '../common/shortcode-type';
import { IClassicPlugin } from '../types';
import { plugin } from './editor';
import { shortcodeTypes } from './shortcode-type';
import { TinyMCEShortcode } from './shortcode-type/tinymce-shortcode';

export const tinymcePlugin: IClassicPlugin<TinyMCEShortcode> = {
	bootstrap() {
		tinymce.PluginManager.add( ns(), plugin );
	},
	shortcodeTypes,
	type: EShortcodeType.TinyMCE,
};
