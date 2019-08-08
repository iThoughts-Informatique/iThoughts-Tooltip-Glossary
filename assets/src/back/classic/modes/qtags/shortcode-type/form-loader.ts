import { shortcodesTypesRegistry } from '../../../shortcode-types-registry';
import { EShortcodeFormat } from '../../common/shortcode-type';
import { IInOutShortcodeFormTransforms, ShortcodeTypeTip } from '../../common/shortcode-type-tip';
import { tinyMCETipFormLoader } from '../../tinymce/shortcode-type/form-loader';
import { TinyMCEShortcode } from '../../tinymce/shortcode-type/tinymce-shortcode';
import { QTagsShortcode } from './qtags-shortcode';

export const qTagsTipFormLoader: IInOutShortcodeFormTransforms<QTagsShortcode> = {
	from( shortcode ) {
		const type = shortcodesTypesRegistry.getType( this, EShortcodeFormat.TinyMCE );
		if ( !( type instanceof ShortcodeTypeTip && type.managesFormatFactory( TinyMCEShortcode ) ) ) {
			throw new Error();
		}
		const tinyMCEShortcode = shortcode ? type.convertToShortcode( this.convertFromShortcode( shortcode ) ) : undefined;
		console.log( 'Converted qtag to tinymce', { qtag: shortcode, tinymce: tinyMCEShortcode } );
		return tinyMCETipFormLoader.from.call( type, tinyMCEShortcode );
	},
	to( formOutput ) {
		const type = shortcodesTypesRegistry.getType( this, EShortcodeFormat.TinyMCE );
		if ( !( type instanceof ShortcodeTypeTip && type.managesFormatFactory( TinyMCEShortcode ) ) ) {
			throw new Error();
		}
		const tinyMCEShortcode = tinyMCETipFormLoader.to.call( type, formOutput );
		const shortcode = this.convertToShortcode( type.convertFromShortcode( tinyMCEShortcode ) );
		console.log( 'Converted tinymce to qtag', { tinymce: tinyMCEShortcode, qtag: shortcode } );
		return shortcode;
	},
};
