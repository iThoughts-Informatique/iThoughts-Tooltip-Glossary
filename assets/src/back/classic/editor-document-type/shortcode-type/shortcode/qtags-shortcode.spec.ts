import Shortcode from '@wordpress/shortcode';

import { QTagsShortcode } from './qtags-shortcode';

// tslint:disable: no-string-literal
beforeEach( () => {
	jest.clearAllMocks();
} );
describe( 'Construct a shortcode', () => {
	it( 'Has the correct tag', () => {
		expect( QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: '',
			tag: 'foo',
			type: 'closed',
		} ) ).tag ).toBe( 'foo' );
		expect( QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: '',
			tag: 'bar',
			type: 'self-closing',
		} ) ).tag ).toBe( 'bar' );
	} );
	it( 'Has the correct content', () => {
		expect( QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: 'foo',
			tag: '',
			type: 'closed',
		} ) ).content ).toBe( 'foo' );
		expect( QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: 'bar',
			tag: '',
			type: 'self-closing',
		} ) ).content ).toBe( 'bar' );
	} );
	describe( 'Has the correct attributes', () => {
		it( 'With named attributes', () => {
			const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
				attrs: {named: {
					baz: 'qux',
					foo: 'bar',
				},      numeric: []},
				content: '',
				tag: '',
				type: 'closed',
			} ) );
			expect( shortcode.attributes ).toBeInstanceOf( Object );
			expect( shortcode.attributes!.foo ).toBe( 'bar' );
			expect( shortcode.attributes!.baz ).toBe( 'qux' );
			expect( shortcode.attributes!.hello ).toBe( undefined );
		} );
		it( 'With numeric attributes', () => {
			const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
				attrs: {named: {}, numeric: [
					'foo',
					'baz',
				]},
				content: '',
				tag: '',
				type: 'closed',
			} ) );
			expect( shortcode.attributes!.foo ).toBe( true );
			expect( shortcode.attributes!.baz ).toBe( true );
			expect( shortcode.attributes!.hello ).toBe( undefined );
		} );
	} );
} );
describe( 'Content checking & type relation', () => {
	it( 'Sync attributes with shortcode', () => {
		const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: { exampleAttr: 'exampleVal' }, numeric: ['exampleNumeric'] },
			content: 'content',
			tag: 'tag',
			type: 'closed',
		} ) );

		shortcode.attributes!.exampleAttr = 'anotherVal';
		delete shortcode.attributes!.exampleNumeric;
		shortcode.attributes!.exampleNumericChanged = true;

		shortcode['syncAttributes']();

		expect( shortcode['shortcode'].attrs.named ).toEqual( { 'example-attr': 'anotherVal' } );
		expect( shortcode['shortcode'].attrs.numeric ).toEqual( ['example-numeric-changed'] );
	} );
	it.each`
	originalType        | originalContent | expectedType
	${ 'closed' }       | ${ 'foo' }      | ${ 'closed' }
	${ 'self-closing' } | ${ 'foo' }      | ${ 'closed' }
	${ 'single' }       | ${ 'foo' }      | ${ 'closed' }
	${ 'closed' }       | ${ undefined }  | ${ 'self-closing' }
	${ 'self-closing' } | ${ undefined }  | ${ 'self-closing' }
	${ 'single' }       | ${ undefined }  | ${ 'self-closing' }
	`( 'With original type $originalType & content $originalContent, should be of type $expectedType', ( {
		originalType, originalContent, expectedType,
	} ) => {
		const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: originalContent,
			tag: 'tag',
			type: originalType,
		} ) );
		expect( shortcode['shortcode'].content ).toBe( originalContent );
		expect( shortcode['shortcode'].type ).toBe( expectedType );
	} );
	it.each`
        originalType        | originalContent | newContent     | expectedType
        ${ 'closed' }       | ${ 'foo' }      | ${ 'bar' }     | ${ 'closed' }
        ${ 'self-closing' } | ${ undefined }  | ${ 'bar' }     | ${ 'closed' }
        ${ 'single' }       | ${ undefined }  | ${ 'bar' }     | ${ 'closed' }
        ${ 'closed' }       | ${ 'foo' }      | ${ undefined } | ${ 'self-closing' }
        ${ 'self-closing' } | ${ undefined }  | ${ undefined } | ${ 'self-closing' }
        ${ 'single' }       | ${ undefined }  | ${ undefined } | ${ 'self-closing' }
	`( 'To closed', ( {
		originalType, originalContent, newContent, expectedType,
	} ) => {
		const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: originalContent,
			tag: 'tag',
			type: originalType,
		} ) );
		shortcode.content = newContent;
		shortcode['syncAttributes']();
		expect( shortcode['shortcode'].content ).toBe( newContent );
		expect( shortcode['shortcode'].type ).toBe( expectedType );
	} );
} );

describe( 'toString', () => {
	it( 'Should call `syncAttributes`', () => {
		const syncAttributesSpy = jest.spyOn( QTagsShortcode.prototype, 'syncAttributes' as any );

		const shortcode = QTagsShortcode.fromShortcode( new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: 'content',
			tag: 'tag',
			type: 'closed',
		} ) );
		shortcode.toString();
		expect( syncAttributesSpy ).toHaveBeenCalledTimes( 2 );
	} );
	it( 'Should call @wordpress/shortcode "string" method', () => {
		const shortcodeStringSpy = jest.spyOn( Shortcode, 'string' ).mockReturnValue( 'retVal' );
		const shortcodeContent = {
			attrs: { named: {}, numeric: [] },
			content: 'content',
			tag: 'tag',
			type: 'closed' as const,
		};
		const shortcode = QTagsShortcode.fromShortcode( new Shortcode( shortcodeContent ) );
		expect( shortcode.toString() ).toBe( 'retVal' );
		expect( shortcodeStringSpy ).toHaveBeenCalledTimes( 1 );
		expect( shortcodeStringSpy.mock.calls[0][0] ).toEqual( shortcode['shortcode'] );
	} );
} );

describe( 'fromString', () => {
	it( 'Should use a node innerHTML setter', () => {
		const nextSpy = jest.spyOn( Shortcode, 'next' ).mockReturnValueOnce( { content: '[foo/]', index: 0, shortcode: new Shortcode( {
			attrs: { named: {}, numeric: [] },
			content: '',
			tag: '',
			type: 'closed',
		} ) } );
		QTagsShortcode.fromString( '[foo/]', 'foo' );
		expect( nextSpy ).toHaveBeenCalledTimes( 1 );
		expect( nextSpy ).toHaveBeenCalledWith( 'foo', '[foo/]' );
	} );
	it( 'Should construct a HtmlShortcode with correct parameters', () => {
		const nextSpy = jest.spyOn( Shortcode, 'next' ).mockReturnValueOnce( { content: '[foo/]', index: 0, shortcode: new Shortcode( {
			attrs: { named: { exampleAttr: 'exampleVal' }, numeric: ['exampleNumeric'] },
			content: '__CONTENT__',
			tag: '__TAG__',
			type: 'closed',
		} ) } );
		const shortcode = QTagsShortcode.fromString( '[foo/]' );
		expect( shortcode.content ).toBe( '__CONTENT__' );
		expect( shortcode.tag ).toBe( '__TAG__' );
		expect( shortcode.attributes!.exampleAttr ).toBe( 'exampleVal' );
		expect( shortcode.attributes!.exampleNumeric ).toBe( true );
	} );
	it( 'Should throw if provided extra content', () => {
		jest.spyOn( Shortcode, 'next' ).mockReturnValueOnce( { content: '[foobar/]', index: 1, shortcode: new Shortcode( {
			attrs: { named: { exampleAttr: 'exampleVal' }, numeric: ['exampleNumeric'] },
			content: '__CONTENT__',
			tag: '__TAG__',
			type: 'closed',
		} ) } );
		expect( () => QTagsShortcode.fromString( ' [foobar/]' ) ).toThrow();
		jest.spyOn( Shortcode, 'next' ).mockReturnValueOnce( { content: '[foobar/]', index: 0, shortcode: new Shortcode( {
			attrs: { named: { exampleAttr: 'exampleVal' }, numeric: ['exampleNumeric'] },
			content: '__CONTENT__',
			tag: '__TAG__',
			type: 'closed',
		} ) } );
		expect( () => QTagsShortcode.fromString( '[foobar/] ' ) ).toThrow();
	} );
} );
