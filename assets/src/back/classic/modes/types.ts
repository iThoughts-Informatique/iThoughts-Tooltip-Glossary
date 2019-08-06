import { AShortcode } from './common/a-shortcode';
import { EShortcodeType, ShortcodeType } from './common/shortcode-type';

export interface IClassicPlugin<TShortcode extends AShortcode> {
	bootstrap(): void;
	type: EShortcodeType;
	shortcodeTypes: Array<ShortcodeType<TShortcode>>;
}
