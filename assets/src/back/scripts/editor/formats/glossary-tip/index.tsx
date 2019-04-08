import { __, registerFormatType } from '../../../wp-binds';
import { makeGlossaryTipEdit } from './edit';
import { resolveUrl } from '../../../manifest';
import { SvgComponent } from '../../../utils-components';

// https://wordpress.org/gutenberg/handbook/designers-developers/developers/tutorials/format-api/

const title = __('Glossary tip');

const iconUrl = resolveUrl('back-icon.svg');
registerFormatType( 'glossary-tip', {
	title,
	icon: <SvgComponent src={ iconUrl } style={ {width: 20, height: 20} }/>,
	className: null,
	tagName: 'glossary-tip',
	attributes: {
		url: 'href',
		target: 'target',
	},
	editFactory: makeGlossaryTipEdit,
} );
