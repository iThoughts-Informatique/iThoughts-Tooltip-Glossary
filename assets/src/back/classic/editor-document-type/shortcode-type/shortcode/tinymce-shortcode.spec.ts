jest.mock( '@ithoughts/tooltip-glossary/common' );
// @ts-ignore
import { makeHtmlElement } from '@ithoughts/tooltip-glossary/common';

import { TinyMCEShortcode } from './tinymce-shortcode';

// tslint:disable: no-string-literal
beforeEach( () => {
	jest.clearAllMocks();
} );
describe( 'Construct a shortcode', () => {
	it( 'Has the correct tag', () => {
		expect( new TinyMCEShortcode( 'foo', 'bar', {} ).tag ).toBe( 'foo' );
		expect( new TinyMCEShortcode( 'bar', undefined, {} ).tag ).toBe( 'bar' );
	} );
	it( 'Has the correct content', () => {
		expect( new TinyMCEShortcode( 'bar', 'foo', {} ).content ).toBe( 'foo' );
		expect( new TinyMCEShortcode( 'qux', 'bar' ).content ).toBe( 'bar' );
	} );
} );

describe( 'toString', () => {
	it( 'Should create a dummy node with correct tag', () => {
		new TinyMCEShortcode( 'foo' ).toString();
		expect( makeHtmlElement ).toHaveBeenCalledTimes( 1 );
	} );
	it( 'Should return the dom node stringified', () => {
		const outerHTML = jest.spyOn( HTMLElement.prototype, 'outerHTML', 'get' ).mockReturnValue( '__DOM_NODE__' );
		expect( new TinyMCEShortcode( 'foo' ).toString() ).toBe( '__DOM_NODE__' );
		expect( outerHTML ).toHaveBeenCalledTimes( 1 );
	} );
} );
describe( 'fromString', () => {
	it( 'Should use a dummy node', () => {
		jest.spyOn( HTMLElement.prototype, 'childNodes', 'get' )
			.mockReturnValue( [{
				attributes: {},
				nodeName: 'html-shortcode',
			} as any] as any );
		TinyMCEShortcode.fromString( 'tag content' );
		expect( makeHtmlElement ).toHaveBeenCalledTimes( 1 );
		expect( ( makeHtmlElement as jest.Mock<any, any> ).mock.calls[0][0] ).toEqual( { tag: 'div', content: 'tag content' } );
	} );
	it( 'Should throw if provided extra content', () => {
		const childNodes = jest.spyOn( HTMLElement.prototype, 'childNodes', 'get' )
			.mockReturnValue( [{
				attributes: {},
				nodeName: 'html-shortcode',
			} as any] as any );
		childNodes.mockReturnValue( [{ nodeName: '', attributes: {}}, { nodeName: '', attributes: {}}] as any );
		expect( () => TinyMCEShortcode.fromString( '' ) ).toThrow();
		childNodes.mockReturnValue( [] as any );
		expect( () => TinyMCEShortcode.fromString( '' ) ).toThrow();
	} );
} );
