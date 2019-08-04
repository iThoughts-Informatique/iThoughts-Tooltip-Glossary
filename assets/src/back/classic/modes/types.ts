import { AShortcode } from './a-shortcode';
import { EShortcodeType, ShortcodeType } from './shortcode-type';

export interface IClassicPlugin<TShortcode extends AShortcode> {
	bootstrap(): void;
	type: EShortcodeType;
	shortcodeTypes: Array<ShortcodeType<TShortcode>>;
}
