import { isString } from 'underscore';

import { CSS_NAMESPACE, uuid } from '@ithoughts/tooltip-glossary/back/common';
import { cleanObject, ETipType, isGlossarytip, isTooltip } from '@ithoughts/tooltip-glossary/common';

import { TipFormOutput } from '../../../forms';
import { IInOutShortcodeFormTransforms } from '../../common/shortcode-type-tip';
import { baseTipClass } from '../editor/utils';
import { TinyMCEShortcode } from './tinymce-shortcode';

const getTipClasses = ( type: ETipType ) => [baseTipClass, `${CSS_NAMESPACE}-${type}`];
const getAttributesFromFormOutput = ( formOutput: TipFormOutput ) => {
	const typeName = ETipType[formOutput.type];
	const baseAttributes = {
		...formOutput.otherAttrs,
		class: getTipClasses( formOutput.type )
			.concat( formOutput.otherAttrs && typeof formOutput.otherAttrs.class === 'string' ?
				formOutput.otherAttrs.class.split( /\s+/ ) :
				[] )
			.join( ' ' ),
		href: formOutput.linkTarget,
		tipUuid: uuid( 'tip' ),
	};
	if ( formOutput.type === ETipType.Glossarytip ) {
		const { termId } = formOutput;
		return {
			...baseAttributes,
			termId: formOutput.termId,
			tipType: formOutput.type,
		} as const;
	} else if ( formOutput.type === ETipType.Tooltip ) {
		return {
			...baseAttributes,
			content: formOutput.content,
			tipType: formOutput.type,
		} as const;
	} else {
		throw new Error();
	}
};
export const tinyMCETipFormLoader: IInOutShortcodeFormTransforms<TinyMCEShortcode> = {
	from( shortcode ) {
		if ( shortcode ) {
			// Load actual shortcode
			const { attributes = {}, content } = shortcode;

			// Keep all base attributes that are not tip related
			const defaultTipClasses = getTipClasses( this.type );
			const unhandledAttrs = {
				...attributes,
				class:  attributes.class ?
					attributes.class.toString().split( /\s+/ ).filter( c => !defaultTipClasses.includes( c ) ).join( ' ' ) || undefined :
					undefined,
				href: undefined,
				tipType: undefined,
				tipUuid: undefined,
			};
			const baseProps = {
				linkTarget: attributes.href as string,
				text: content || '',
			};
			if ( this.type === ETipType.Tooltip ) {
				return {
					...baseProps,
					content: attributes.content as string,
					type: ETipType.Tooltip,

					otherAttrs: cleanObject( { ...unhandledAttrs, content: undefined } ),
				};
			} else if ( this.type === ETipType.Glossarytip ) {
				return {
					...baseProps,
					termId: attributes.termId as number,
					type: ETipType.Glossarytip,

					otherAttrs: cleanObject( { ...unhandledAttrs, termId: undefined } ),
				};
			} else {
				throw new SyntaxError( `Could not determine the tip form loader for ${this.type}` );
			}
		} else {
			// Default
			return {
				text: '',
				type: this.type,
			};
		}
	},
	to( formOutput ) {

		const shortcodeAttributes = getAttributesFromFormOutput( formOutput );
		console.log( { formOutput, shortcodeAttributes } );

		return new TinyMCEShortcode( 'a', formOutput.text, shortcodeAttributes );
	},
};
