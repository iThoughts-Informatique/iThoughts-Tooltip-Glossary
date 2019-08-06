import { AShortcode } from './modes/common/a-shortcode';
import { EShortcodeType, ShortcodeType } from './modes/common/shortcode-type';

export const shortcodesTypesRegistry: {[key in EShortcodeType]?: Array<ShortcodeType<AShortcode>>} = {};
