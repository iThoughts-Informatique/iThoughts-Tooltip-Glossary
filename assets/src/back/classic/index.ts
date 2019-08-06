import { AShortcode } from './modes/common/a-shortcode';
import { qtagsPlugin } from './modes/qtags';
import { tinymcePlugin } from './modes/tinymce';
import { IClassicPlugin } from './modes/types';

import { shortcodesTypesRegistry } from './shortcode-types-registry';
export { shortcodesTypesRegistry };

const registerMode = ( modePlugin: IClassicPlugin<AShortcode> ) => {
	modePlugin.bootstrap();
	shortcodesTypesRegistry[modePlugin.type] = modePlugin.shortcodeTypes;
};

export const bootstrap = () => {
	registerMode( tinymcePlugin );
	registerMode( qtagsPlugin );
};
bootstrap();
