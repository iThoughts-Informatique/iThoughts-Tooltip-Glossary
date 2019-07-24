
import { ensureArray } from '@ithoughts/tooltip-glossary/back/common';
import { convertCamelCaseToDashCaseAttrs, makeHtmlElement, parseHtmlElement } from '@ithoughts/tooltip-glossary/common';

import { IShortcodeTypeDescriptor } from '../shortcode-type';
import { AShortcode, IShortcodeSearchResult } from './a-shortcode';

export class TinyMCEShortcode extends AShortcode {
	public toString(): string {
		const htmlNode = makeHtmlElement( this );
		return htmlNode.outerHTML;
	}

	public static fromString( htmlText: string, selector?: string ): TinyMCEShortcode {
		const node = makeHtmlElement( { tag: 'div', content: htmlText } );
		if ( node.childNodes.length !== 1 ) {
			throw new SyntaxError();
		}
		const child = node.childNodes[0] as HTMLElement;
		if ( typeof selector !== 'undefined' ) {
			const selectorRes = node.querySelectorAll( selector );
			if ( selectorRes.length !== 0 || selectorRes[0] !== child ) {
				throw new SyntaxError();
			}
		}
		return this.fromHtmlElement( child );
	}

	public static *findNext( htmlContent: string, selector: IShortcodeTypeDescriptor | string ): IterableIterator<IShortcodeSearchResult<TinyMCEShortcode>> {
		const selectorDefaulted = typeof selector === 'string' ?
			{ tag: selector } :
			selector;
		const tags = ensureArray( selectorDefaulted.tag || '[\\w-]+' );
		const matchTag = `(?:${tags.join( '|' )})`;
		const anyAttrsRegex = '(?:\\s+[\\w-]+(?:=(?:"[^"]*?"|[\\w-]+)))*?';
		if ( Array.isArray( selectorDefaulted.attributes ) && selectorDefaulted.attributes.length > 1 ) {
			throw new Error( 'Not implemented' );
		}
		const attributes = ( Array.isArray( selectorDefaulted.attributes ) ?
			selectorDefaulted.attributes[0] :
			selectorDefaulted.attributes ) || {};
		const attrsEntries = Object.entries( convertCamelCaseToDashCaseAttrs( attributes, tags[0] ) );
		if ( attrsEntries.length > 1 ) {
			throw new Error( 'Not implemented' );
		}
		const attrsSelector = attrsEntries
			.map( ( [key, value] ) => `(?:\\s+${key}="${value}")` )
			.map( regexAttr => `${regexAttr}${anyAttrsRegex}` );
		// <a(?:\s+[\w-]+(?:=(?:".*?"|\S+)))*?(?:\s+data-type=(?:"Tooltip"|Tooltip))(?:\s+[\w-]+(?:=(?:".*?"|\S+)))*?>.*?<\/a>
		const regexMatchShortcode = new RegExp( `<${matchTag}${anyAttrsRegex}${attrsSelector.join( '' )}\s*>.*?</${matchTag}>`, 'gi' );
		const instances = ( htmlContent as any ).matchAll( regexMatchShortcode ) as IterableIterator<RegExpMatchArray>;
		let lastEnd = -1;

		for ( const instance of instances ) {
			const htmlShortcode = this.fromString( instance[0] );

			if ( this.isValidForSelector( htmlShortcode, selector ) ) {
				lastEnd++;
				const start = instance.index || 0;
				lastEnd = start + instance[0].length;

				yield {
					end: lastEnd,
					start,

					source: instance[0],
					tag: htmlShortcode,
				};
			}
		}
	}

	private static fromHtmlElement( htmlElement: HTMLElement ): TinyMCEShortcode {
		const { tag, content, attributes } = parseHtmlElement( htmlElement );
		return new TinyMCEShortcode( tag, content, attributes );
	}
}
