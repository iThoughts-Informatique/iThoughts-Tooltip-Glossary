import { __, registerFormatType } from '../../../wp-binds';
import { makeTooltipEdit } from './edit';
import { resolveUrl } from '../../../manifest';
import { SvgComponent } from '../../../utils-components';

// https://wordpress.org/gutenberg/handbook/designers-developers/developers/tutorials/format-api/

const title = __('Tooltip');

const iconUrl = resolveUrl('back-icon.svg');
registerFormatType( 'tooltip', {
	title,
	icon: <SvgComponent src={ iconUrl } style={ {width: 20, height: 20} }/>,
	className: null,
	tagName: 'tooltip',
	attributes: {
		url: 'href',
		target: 'target',
	},
	editFactory: makeTooltipEdit,
} );
