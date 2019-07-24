import { ensureArray, TMany } from '@ithoughts/tooltip-glossary/back/common';
import { AttrsHash, ITag } from '@ithoughts/tooltip-glossary/common';

import { EShortcodeFormat, IShortcodeTypeDescriptor } from '../shortcode-type';

export type ShortcodeTransformer<TShortcode extends ITag> = ( accumulator: ITag, from: EShortcodeFormat, to: EShortcodeFormat, source: ITag ) => TShortcode;
export type TCastShortcodeTransform<TShortcode extends ITag> = Partial<TShortcode> | ShortcodeTransformer<TShortcode>;
export type TCastShortcodeTransformCollection<TShortcode extends ITag> = TMany<TCastShortcodeTransform<TShortcode>>;
export interface IShortcodeSearchResult<T extends ITag> {
	start: number;
	end: number;
	source: string;
	tag: T;
}
export abstract class AShortcode implements ITag {
	public constructor(
		public tag: ITag['tag'],
		public content?: ITag['content'],
		public attributes: ITag['attributes'] = {},
	) {}

	public abstract toString(): string;

	public static convertFromShortcode<TShortcode extends AShortcode>(
		shortcode: ITag,
		from: EShortcodeFormat,
		to: EShortcodeFormat,
		transforms?: TCastShortcodeTransformCollection<TShortcode>,
	): TShortcode {
		const shortcodeInSerialized = { attributes: shortcode.attributes, content: shortcode.content, tag: shortcode.tag };
		const transformedShortcode = ensureArray( transforms )
			.reduce( ( intermediateShortcode, transform ) => {
				const diffObject = typeof transform === 'function' ?
					transform( intermediateShortcode, from, to, shortcodeInSerialized ) :
					transform;
				return {
						...intermediateShortcode,
						...diffObject,

						attributes: { ...intermediateShortcode.attributes, ...diffObject.attributes },
				};
			},       shortcodeInSerialized );
		return new ( this as any )( transformedShortcode.tag, transformedShortcode.content, transformedShortcode.attributes );
	}

	protected static isValidForSelector( shortcode: AShortcode, selector: IShortcodeTypeDescriptor | string ) {
		// Keep anyway if the search was made only with tag
		if ( typeof selector === 'string' ) {
			return true;
		}
		// Keep only if attributes matches
		if ( selector.attributes && Object.keys( selector.attributes ).length > 0 ) {
			return ensureArray<AttrsHash>( selector.attributes )
				.some( attr => Object.entries( attr )
					.every( ( [attrName, attrVal] ) => ( shortcode.attributes || {} )[attrName] === attrVal ) );
		} else {
			return true;
		}
	}
}
export interface IShortcodeStatic<T extends AShortcode> {
	fromString( content: string, selector?: string ): T;
	findNext( content: string, selector: IShortcodeTypeDescriptor | string ): IterableIterator<IShortcodeSearchResult<T>>;
}
