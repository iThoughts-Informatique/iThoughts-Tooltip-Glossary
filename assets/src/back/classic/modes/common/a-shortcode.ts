import { ensureArray, TMany } from '@ithoughts/tooltip-glossary/back/common';
import { AttrsHash, ITag } from '@ithoughts/tooltip-glossary/common';

import { EShortcodeFormat, IShortcodeTypeDescriptor } from './shortcode-type';

export type ShortcodeTransformer = ( accumulator: ITag, source: ITag ) => ITag;
export type TCastShortcodeTransform<TShortcode extends ITag> = Partial<TShortcode> | ShortcodeTransformer;
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

	protected static isValidForSelector( shortcode: AShortcode, selector: Partial<IShortcodeTypeDescriptor> | string ) {
		// Keep anyway if the search was made only with tag
		if ( typeof selector === 'string' ) {
			return true;
		}
		let valid = true;
		// Keep only if attributes matches
		if ( selector.attributes ) {
			valid = valid && ensureArray<AttrsHash>( selector.attributes )
				.some( attr => Object.entries( attr )
					.every( ( [attrName, attrVal] ) => ( shortcode.attributes || {} )[attrName] === attrVal ) );
		}
		// Keep only if attributes matches
		if ( selector.content ) {
			valid = valid && ensureArray( selector.content )
				.some( content => content === shortcode.content );
		}

		return valid;
	}
}
export interface IShortcodeStatic<T extends AShortcode> {
	fromString( content: string, selector?: string ): T;
	findNext( content: string, selector: Partial<IShortcodeTypeDescriptor> | string ): IterableIterator<IShortcodeSearchResult<T>>;
}
