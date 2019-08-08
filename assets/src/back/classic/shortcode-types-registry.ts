import { isNotNil, ITag } from '@ithoughts/tooltip-glossary/common';

import { AShortcode } from './modes/common/a-shortcode';
import { EShortcodeFormat, ShortcodeType } from './modes/common/shortcode-type';

export class ShortcodesTypesRegistry {
	private readonly typesGroups: {[id: string]: {[type in EShortcodeFormat]?: ShortcodeType<AShortcode>}} = {};

	public register<TShortcode extends AShortcode>( format: EShortcodeFormat, types: Array<ShortcodeType<TShortcode>> ) {
		types.forEach( type => {
			this.typesGroups[type.id] = {
				...this.typesGroups[type.id],
				[format]: type,
			};
		} );
	}

	public getAllTypesOfFormat( format: EShortcodeFormat ) {
		return Object.entries( this.typesGroups )
			.map( ( [, types] ) => types[format] )
			.filter( isNotNil );
	}

	public convertTo<T extends AShortcode>( shortcode: ITag, shortcodeTypeOrId: string | ShortcodeType<T>, outFormat: EShortcodeFormat ): AShortcode {
		return this.getType( shortcodeTypeOrId, outFormat ).convertToShortcode( shortcode );
	}

	public getType( shortcodeTypeOrId: string | ShortcodeType<AShortcode>, outFormat: EShortcodeFormat ): ShortcodeType<AShortcode> {
		const shortcodeId = typeof shortcodeTypeOrId === 'string' ? shortcodeTypeOrId : shortcodeTypeOrId.id;

		const shortcodeTypes = this.typesGroups[shortcodeId];
		if ( !shortcodeTypes ) {
			throw new Error( `Unknown shortcode ID ${shortcodeId}` );
		}

		const targetType = shortcodeTypes[outFormat];
		if ( !targetType ) {
			throw new Error( `Unknown shortcode type ${outFormat} for id ${shortcodeId}` );
		}

		return targetType;
	}
}
export const shortcodesTypesRegistry = new ShortcodesTypesRegistry();
