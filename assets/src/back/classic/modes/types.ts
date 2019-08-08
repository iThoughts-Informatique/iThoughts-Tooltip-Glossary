import { AShortcode } from './common/a-shortcode';
import { EShortcodeFormat, ShortcodeType } from './common/shortcode-type';

export interface IClassicPlugin<TShortcode extends AShortcode> {
	bootstrap(): void;
	type: EShortcodeFormat;
	shortcodeTypes: Array<ShortcodeType<TShortcode>>;
}
