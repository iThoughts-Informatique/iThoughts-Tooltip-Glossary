import { ensureArray } from '@ithoughts/tooltip-glossary/back/common';
import { AttrsHash, ITag } from '@ithoughts/tooltip-glossary/common';

import { IShortcodeStatic, QTagsShortcode, TinyMCEShortcode } from './shortcode';
import { AShortcode, TCastShortcodeTransform, TCastShortcodeTransformCollection } from './shortcode/a-shortcode';

export enum EShortcodeFormat {
	QTags,
	TinyMCE,
}
export interface IShortcodeTypeDescriptor {
	tag: string | string[];
	attributes?: AttrsHash | AttrsHash[];
}
export class ShortcodeType {
	private readonly transforms: Array<TCastShortcodeTransform<ITag>>;
	protected descriptors: {[key in EShortcodeFormat]: {
		description: IShortcodeTypeDescriptor;
		factory: IShortcodeStatic<AShortcode> & typeof AShortcode;
	}};

	public constructor(
		wpDesc: IShortcodeTypeDescriptor,
		htmlDesc: IShortcodeTypeDescriptor,
		transform: TCastShortcodeTransformCollection<ITag> = [],
	) {
		this.descriptors = {
			[EShortcodeFormat.QTags]: {
				description: wpDesc,
				factory: QTagsShortcode,
			},
			[EShortcodeFormat.TinyMCE]: {
				description: htmlDesc,
				factory: TinyMCEShortcode,
			},
		};
		this.transforms = ensureArray( transform );
	}

	public getAllShortcodes( sourceText: string, formatFrom: EShortcodeFormat, formatTo: EShortcodeFormat ) {
		const {
			[formatFrom]: {
				factory: factoryFrom,
				description: descriptionFrom,
			},
			[formatTo]: {
				factory: factoryTo,
				description: descriptionToRaw,
			},
		} = this.descriptors;

		const descriptionTo: TCastShortcodeTransformCollection<ITag> = {
			attributes: ensureArray<AttrsHash>( descriptionToRaw.attributes || undefined )[0],
			tag: ensureArray( descriptionToRaw.tag )[0],
		};
		const iterator = factoryFrom.findNext( sourceText, descriptionFrom );

		const shortcodeInstances = [...iterator];

		return shortcodeInstances.map( instance => {
			const transformedTag = factoryTo.convertFromShortcode( instance.tag, formatFrom, formatTo, [descriptionTo, ...this.transforms] );
			return {
				...instance,
				tag: transformedTag,
			};
		} );
	}
}
