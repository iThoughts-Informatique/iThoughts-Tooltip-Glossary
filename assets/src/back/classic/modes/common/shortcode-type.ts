import { flat, map } from 'iter-tools';

import { ensureArray, TMany } from '@ithoughts/tooltip-glossary/back/common';
import { AttrsHash, ITag } from '@ithoughts/tooltip-glossary/common';

import { AShortcode, IShortcodeSearchResult, IShortcodeStatic, ShortcodeTransformer, TCastShortcodeTransformCollection } from './a-shortcode';

export enum EShortcodeFormat {
	QTags,
	TinyMCE,
}
export interface IShortcodeTypeDescriptor {
	content: TMany<string>;
	tag?: TMany<string>;
	attributes?: TMany<AttrsHash>;
}
export interface IInOutShortcodeTransforms {
	from: TCastShortcodeTransformCollection<ITag>;
	to: TCastShortcodeTransformCollection<ITag>;
}
export interface IBatchShortcodeResult<TShortcode extends AShortcode> {
	type: ShortcodeType<TShortcode>;
	shortcodeSearchResult: IShortcodeSearchResult<ITag>;
}
export type ShortcodeFactory<TShortcode extends AShortcode> = IShortcodeStatic<TShortcode> & ( new( tag: string, content?: string, attributes?: AttrsHash ) => TShortcode );

export class ShortcodeType<TShortcode extends AShortcode> {
	public static wrapShortcodeOverride( override: Partial<ITag> ): ShortcodeTransformer {
		return tag => ( {
			...tag,
			...override,
			attributes: {
				...tag.attributes,
				...override.attributes,
			},
		} );
	}

	public static *getAllShortcodes<TShortcode extends AShortcode>(
		shortcodeTypes: Array<ShortcodeType<TShortcode>>,
		content: string,
	): IterableIterator<IBatchShortcodeResult<TShortcode>> {
		return yield* flat(
			// For each type, get shortcodes iterable associated with type
			shortcodeTypes.map(
				// For each shortcode, associate with the type
				type => map(
					// Associate search result with type
					shortcodeSearchResult => ( { type, shortcodeSearchResult } ),
					// Get the `next` iterable
					type.next( content ) ) ) );
	}

	private static ensureShortcodeTransformers( casts: TCastShortcodeTransformCollection<ITag> | undefined ): ShortcodeTransformer[] {
		return ensureArray( casts ).map( cast => typeof cast === 'function' ? cast : this.wrapShortcodeOverride( cast ) );
	}

	private static applyTransforms( transforms: ShortcodeTransformer[], sourceTag: ITag ) {
		return transforms.reduce( ( acc, transform ) => transform( acc, sourceTag ), sourceTag as ITag );
	}

	private readonly transforms: {
		from: ShortcodeTransformer[];
		to: ShortcodeTransformer[];
	};

	public constructor(
		public readonly id: string,
		private readonly desc: Partial<IShortcodeTypeDescriptor>,
		public readonly factory: ShortcodeFactory<TShortcode>,
		transforms: Partial<IInOutShortcodeTransforms> = { from: [], to: [] },
	) {
		this.transforms = {
			from: ShortcodeType.ensureShortcodeTransformers( transforms.from ),
			to: ShortcodeType.ensureShortcodeTransformers( transforms.to ),
		};
	}

	public *next( sourceText: string ): IterableIterator<IShortcodeSearchResult<ITag>> {
		return yield* map(
			item => {
				const transformedTag = this.convertFromShortcode( item.tag );
				return {
					...item,
					tag: new this.factory( transformedTag.tag, transformedTag.content, transformedTag.attributes ),
				} as IShortcodeSearchResult<ITag>;
			},
			this.factory.findNext( sourceText, this.desc ),
		);
	}

	public convertFromShortcode( shortcode: TShortcode ): ITag {
		return ShortcodeType.applyTransforms( this.transforms.from, shortcode );
	}
	
	public convertToShortcode( tag: ITag ): TShortcode {
		const transformedTag = ShortcodeType.applyTransforms( this.transforms.to, tag );
		return new this.factory( transformedTag.tag, transformedTag.content, transformedTag.attributes );
	}

	public manages<TOther extends AShortcode>( shortcode: TOther ): this is ShortcodeType<TOther> {
		return shortcode instanceof this.factory;
	}

	public managesFormatFactory<T extends AShortcode>( type: ShortcodeFactory<T> ): this is ShortcodeType<T> {
		return type === this.factory as any;
	}
}
