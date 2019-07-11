// tslint:disable-next-line: no-implicit-dependencies
import { JSDOM } from 'jsdom';

import { ITag, makeHtmlElement, parseHtmlElement } from './dom-object';

describe( 'Make html element', () => {
	it.each( [
		['a', HTMLAnchorElement, ''],
		['div', HTMLDivElement, 'foo bar qux'],
	] as Array<[string, any, string]> )( 'Should make simple tags without attributes', ( tag, instance, content ) => {
		const htmlElement = makeHtmlElement( { tag, attributes: {}, content } );
		expect( htmlElement ).toBeInstanceOf( instance );
		expect( htmlElement.tagName ).toBe( tag.toUpperCase() );
		expect( htmlElement.innerHTML ).toBe( content );
		expect( htmlElement.getAttributeNames() ).toHaveLength( 0 );
	} );
	it.each( [
		['a', { href: '#' }],
		['div', { class: 'foo' }],
		['div', { 'data-foo': 'bar' }],
		['foo', { class: 'bar' }],
	] as Array<[string, ITag['attributes']]> )( 'Should support legal attributes', ( tag, attributes ) => {
		const htmlElement = makeHtmlElement( { tag, attributes, content: '' } );
		expect( htmlElement.getAttributeNames() ).toHaveLength( Object.keys( attributes ).length );
		Object.entries( attributes )
			.forEach( ( [attrName, expectedVal] ) => {
				expect( htmlElement.hasAttribute( attrName ) ).toBe( true );
				const attrVal = htmlElement.getAttribute( attrName );
				expect( attrVal ).toBe( expectedVal );
			} );
	} );
	it.each( [
		['a', { foo: '#' }],
		['div', { bar: 'foo' }],
	] as Array<[string, ITag['attributes']]> )( 'Should escape with `data-` illegal attributes', ( tag, attributes ) => {
		const htmlElement = makeHtmlElement( { tag, attributes, content: '' } );
		expect( htmlElement.getAttributeNames() ).toHaveLength( Object.keys( attributes ).length );
		Object.entries( attributes )
			.forEach( ( [attrName, expectedVal] ) => {
				const prefixedAttrName = `data-${attrName}`;
				expect( htmlElement.hasAttribute( prefixedAttrName ) ).toBe( true );
				const attrVal = htmlElement.getAttribute( prefixedAttrName );
				expect( attrVal ).toBe( expectedVal );
			} );
	} );
	it.each( [
		[{ class: 1 }],
		[{ class: 1.6 }],
		[{ disabled: true }],
	] as Array<[ITag['attributes']]> )( 'Should support non-string types', attributes => {
		const htmlElement = makeHtmlElement( { tag: 'button', attributes, content: '' } );
		expect( htmlElement.getAttributeNames() ).toHaveLength( Object.keys( attributes ).length );
		Object.entries( attributes )
			.forEach( ( [attrName, expectedVal] ) => {
				expect( htmlElement.hasAttribute( attrName ) ).toBe( true );
				const attrVal = htmlElement.getAttribute( attrName );
				if ( expectedVal === true ) {
					expect( attrVal ).toBe( '' );
				} else if ( typeof expectedVal === 'number' ) {
					expect( attrVal ).toEqual( expectedVal.toString() );
				} else {
					expect( attrVal ).toBe( expectedVal );
				}
			} );
	} );
} );

describe( 'Parse html element', () => {
	it.each( [
		['<a></a>', { tag: 'a', content: '' }],
		['<div>foo</div>', { tag: 'div', content: 'foo' }],
	] as Array<[string, ITag]> )( 'Should parse simple tags without attributes', ( html, content ) => {
		const tag = parseHtmlElement( new JSDOM( `<!DOCTYPE html>${html}` ).window.document.body.firstElementChild as HTMLElement );
		expect( tag ).toEqual( { ...content, attributes: {}} );
	} );
	it.each( [
		['<a href="#"></a>', { tag: 'a', attributes: { href: '#' }}],
		['<div class="foo"></div>', { tag: 'div', attributes: { class: 'foo' }}],
	] as Array<[string, Pick<ITag, 'attributes' | 'tag'>]> )( 'Should parse tags with legal attributes', ( html, content ) => {
		const tag = parseHtmlElement( new JSDOM( `<!DOCTYPE html>${html}` ).window.document.body.firstElementChild as HTMLElement );
		expect( tag ).toEqual( { ...content, content: '' } );
	} );
	it.each( [
		['<a data-foo="bar"></a>', { tag: 'a', attributes: { foo: 'bar' }}],
		['<div class="foo" data-bar="qux"></div>', { tag: 'div', attributes: { class: 'foo', bar: 'qux' }}],
		['<a data-href="bar"></a>', { tag: 'a', attributes: { href: 'bar' }}],
		['<a data-data-foo="bar"></a>', { tag: 'a', attributes: { dataFoo: 'bar' }}],
	] as Array<[string, Pick<ITag, 'attributes' | 'tag'>]> )( 'Should parse tags with escaped attributes', ( html, content ) => {
		const tag = parseHtmlElement( new JSDOM( `<!DOCTYPE html>${html}` ).window.document.body.firstElementChild as HTMLElement );
		expect( tag ).toEqual( { ...content, content: '' } );
	} );
	it.each( [
		['<a data-foo="1"></a>', { tag: 'a', attributes: { foo: 1 }}],
		['<a data-foo="1.2"></a>', { tag: 'a', attributes: { foo: 1.2 }}],
		['<a data-foo></a>', { tag: 'a', attributes: { foo: true }}],
	] as Array<[string, Pick<ITag, 'attributes' | 'tag'>]> )( 'Should parse tags with non-string attributes', ( html, content ) => {
		const tag = parseHtmlElement( new JSDOM( `<!DOCTYPE html>${html}` ).window.document.body.firstElementChild as HTMLElement );
		expect( tag ).toEqual( { ...content, content: '' } );
	} );
} );
