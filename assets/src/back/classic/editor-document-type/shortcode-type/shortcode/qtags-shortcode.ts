import Shortcode, { next, NextMatch, ShortcodeAttrs } from '@wordpress/shortcode';
import { Dictionary, isUndefined } from 'underscore';

import { ECharEscapeSet, ensureArray, escapeString, unescapeString } from '@ithoughts/tooltip-glossary/back/common';
import { camelCaseToDashCase, dashCaseToCamelCase, ITag, strToAttrVal } from '@ithoughts/tooltip-glossary/common';

import { IShortcodeTypeDescriptor } from '../shortcode-type';
import { AShortcode, IShortcodeSearchResult } from './a-shortcode';

export class QTagsShortcode extends AShortcode {
	protected shortcode: Shortcode = this.syncAttributes();

	public toString(): string {
		this.syncAttributes();
		return this.shortcode.string();
	}

	private syncAttributes() {
		this.shortcode = new Shortcode( {
			attrs: QTagsShortcode.transformAttrsToWpFormat( this.attributes ),
			content: this.content,
			tag: this.tag,
			type: this.content ? 'closed' : 'self-closing',
		} );
		return this.shortcode;
	}

	public static fromString( wpContent: string, selector?: string ): QTagsShortcode {
		const tagMatch = wpContent.match( /^\[([\w\-]+)/ );
		if ( !tagMatch ) {
			throw new SyntaxError();
		}
		if ( !isUndefined( selector ) && tagMatch[1] !== selector ) {
			throw new SyntaxError();
		}
		const match = next( tagMatch[1], wpContent );
		if ( typeof match === 'undefined' || match.content !== wpContent ) {
			throw new SyntaxError();
		}
		return this.fromShortcode( match.shortcode );
	}
	public static fromShortcode( shortcode: Shortcode ): QTagsShortcode {
		const attributes = {
			...Object.fromEntries( Object
				.entries( shortcode.attrs.named )
				.map( ( [attrName, attrVal] ) => [
					dashCaseToCamelCase( attrName ),
					strToAttrVal( unescapeString( attrVal || '', ECharEscapeSet.Wp ) ),
				] as const ) ),
			...shortcode.attrs.numeric.reduce( ( attrsAcc, attr ) => {
				attrsAcc[dashCaseToCamelCase( attr )] = true;
				return attrsAcc;
			},                                 {} as Dictionary<true> ),
		};
		const newWpShortcode = new QTagsShortcode( shortcode.tag, shortcode.content, attributes );
		return newWpShortcode;
	}

	private static *getAllShortcodesOfTag( tag: string, text: string ) {
		let index = 0;
		let nextShortcode: NextMatch | undefined;
		do {
			nextShortcode = next( tag, text, index );
			if ( nextShortcode ) {
				index = nextShortcode.index + 1;
				yield nextShortcode;
			}
		} while ( nextShortcode );
	}

	public static *findNext( wpContent: string, selector: IShortcodeTypeDescriptor | string ): IterableIterator<IShortcodeSearchResult<QTagsShortcode>> {
		const tag = typeof selector === 'string' ? selector : selector.tag;

		const allShortcodes = ( ensureArray( tag ) || [] )
			.flatMap( t => [...this.getAllShortcodesOfTag( t, wpContent )] )
			.filter( <T>( msc?: T ): msc is T => typeof msc !== 'undefined' )
			.map( ( { content, index, shortcode } ) => ( {
				source: content,
				tag: this.fromShortcode( shortcode ),

				end: content.length + index,
				start: index,
			} ) )
			.filter( shortcodeMatch => this.isValidForSelector( shortcodeMatch.tag, selector ) )
			.sort( ( a, b ) => b.start - a.start );

		return yield* allShortcodes;
	}

	private static transformAttrsToWpFormat( obj: ITag['attributes'] = {} ): ShortcodeAttrs {
		return Object.entries( obj )
			.map( ( [attrName, attrVal] ) => [camelCaseToDashCase( attrName ), attrVal] as const )
			.reduce( ( attrsAcc, [key, value] ) => {
				if ( value === true ) {
					attrsAcc.numeric.push( key );
				} else if ( typeof value !== 'undefined' ) {
					attrsAcc.named[key] = escapeString( value.toString(), ECharEscapeSet.Wp );
				}
				return attrsAcc;
				// TODO: File issue about this: members declaration ordering matters.
			},       { named: {} as Dictionary<string>, numeric: [] as string[] } );
	}
}
