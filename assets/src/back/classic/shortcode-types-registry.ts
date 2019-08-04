import { AShortcode } from './modes/a-shortcode';
import { EShortcodeType, ShortcodeType } from './modes/shortcode-type';

export const shortcodesTypesRegistry: {[key in EShortcodeType]?: Array<ShortcodeType<AShortcode>>} = {};
