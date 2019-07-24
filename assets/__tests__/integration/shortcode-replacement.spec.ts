import { editorDocumentType } from '@ithoughts/tooltip-glossary/back/classic/editor-document-type';
import { EShortcodeFormat } from '@ithoughts/tooltip-glossary/back/classic/editor-document-type/shortcode-type';
import { baseTipClass } from '@ithoughts/tooltip-glossary/back/classic/utils';
import { CSS_NAMESPACE } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType } from '@ithoughts/tooltip-glossary/common';
import escapeStringRegexp = require( 'escape-string-regexp' );

describe.each( [
	['TinyMCE', 'QTags'],
	['QTags', 'TinyMCE'],
] )( 'Should convert properly %s to %s', ( fromType, toType ) => {
	const maybeFlip = <T>( set: Array<[T, T]> ) => set
		.map( ( [a, b], index ) => fromType === 'TinyMCE' && toType === 'QTags' ? [index + 1, a, b] : [index + 1, b, a] ) as Array<[number, T, T]>;
	const getShortcodeFormat = ( type: string ) => type === 'TinyMCE' ? EShortcodeFormat.TinyMCE : EShortcodeFormat.QTags;
	enum EFilterType {
		Uuid = 0b01,
		Class = 0b10,
	}
	// tslint:disable-next-line: no-bitwise
	const maybePostFilterOutput = ( out: string, filterType =  EFilterType.Class | EFilterType.Uuid ) => {
		if ( fromType === 'TinyMCE' && toType === 'QTags' ) {
		} else {
			// tslint:disable-next-line: no-bitwise
			if ( filterType & EFilterType.Class ) {
				out = out.replace( /\s+class=".*?"/g, '' );
			}
			// tslint:disable-next-line: no-bitwise
			if ( filterType & EFilterType.Uuid ) {
				out = out.replace( /\s+data-tip-uuid=".*?"/g, '' );
			}
		}
		return out;
	};

	it.each( maybeFlip( [
		['<p>Hello world</p>', '<p>Hello world</p>'],
		['<p><a href="foo">Hello</a> world</p>', '<p><a href="foo">Hello</a> world</p>'],
	] ) )( 'Should not change simple HTML case (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ) ) ).toEqual( to );
	} );
	it.each( maybeFlip( [
		[`<p><a data-tip-type="${ETipType.Tooltip}">Tooltip</a></p>`, '<p>[tooltip]Tooltip[/tooltip]</p>'],
		[`<p><a data-tip-type="${ETipType.Glossarytip}">Glossarytip</a></p>`, '<p>[glossary]Glossarytip[/glossary]</p>'],
	] ) )( 'Should match & replace basic minimum shortcodes (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ) ) ).toEqual( to );
	} );

	it.each( maybeFlip( [
		[
			`<p><a data-content="<p>&quot;</p>" data-tip-type="${ETipType.Tooltip}">Tooltip</a></p>`,
			'<p>[tooltip content="<p>&quot;</p>"]Tooltip[/tooltip]</p>',
		],
		[
			`<p><a title="&quot;" data-tip-type="${ETipType.Tooltip}">Tooltip</a></p>`,
			'<p>[tooltip title="&quot;"]Tooltip[/tooltip]</p>',
		],
	] ) )( 'Should support quotes escapes in attributes (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ) ) ).toEqual( to );
	} );
	it.each( maybeFlip( [
		[
			`<p><a data-tip-type="${ETipType.Tooltip}">Tooltip1</a>Foo<a data-tip-type="${ETipType.Tooltip}">Tooltip2</a></p>`,
			'<p>[tooltip]Tooltip1[/tooltip]Foo[tooltip]Tooltip2[/tooltip]</p>',
		],
		[
			`<p><a data-tip-type="${ETipType.Tooltip}">Tooltip</a>Foo<a data-tip-type="${ETipType.Glossarytip}">Glossarytip</a></p>`,
			'<p>[tooltip]Tooltip[/tooltip]Foo[glossary]Glossarytip[/glossary]</p>',
		],
		[
			`<p><a data-tip-type="${ETipType.Glossarytip}">Glossarytip1</a>Foo<a data-tip-type="${ETipType.Glossarytip}">Glossarytip2</a></p>`,
			'<p>[glossary]Glossarytip1[/glossary]Foo[glossary]Glossarytip2[/glossary]</p>',
		],
		[
			`<p><a data-tip-type="${ETipType.Glossarytip}">Glossarytip</a>Foo<a data-tip-type="${ETipType.Tooltip}">Tooltip</a></p>`,
			'<p>[glossary]Glossarytip[/glossary]Foo[tooltip]Tooltip[/tooltip]</p>',
		],
	] ) )( 'Should support multiple replacements (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ) ) ).toEqual( to );
	} );
	it.each( maybeFlip( [
		[
			`<p><a data-tip-type="${ETipType.Tooltip}" class="${baseTipClass} ${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]}">Tooltip</a></p>`,
			'<p>[tooltip]Tooltip[/tooltip]</p>',
		],
		[
			`<p><a class="${baseTipClass} ${CSS_NAMESPACE}-${ETipType[ETipType.Tooltip]} foo" data-tip-type="${ETipType.Tooltip}">Tooltip</a></p>`,
			'<p>[tooltip class="foo"]Tooltip[/tooltip]</p>',
		],
		[
			`<p><a data-tip-type="${ETipType.Glossarytip}" class="${baseTipClass} ${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]}">Glossarytip</a></p>`,
			'<p>[glossary]Glossarytip[/glossary]</p>',
		],
		[
			`<p><a class="${baseTipClass} ${CSS_NAMESPACE}-${ETipType[ETipType.Glossarytip]} foo" data-tip-type="${ETipType.Glossarytip}">Glossarytip</a></p>`,
			'<p>[glossary class="foo"]Glossarytip[/glossary]</p>',
		],
	] ) )( 'Should filter & replace classes (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ), EFilterType.Uuid ) ).toEqual( to );
	} );

	if ( fromType === 'TinyMCE' ) {
		it( 'Should remove tip uuid', () => {
			expect( editorDocumentType.convert(
				`<p><a data-tip-uuid="foo" data-tip-type="${ETipType.Glossarytip}">Glossarytip</a></p>`,
				getShortcodeFormat( fromType ),
				getShortcodeFormat( toType ),
			) ).toEqual(
				'<p>[glossary]Glossarytip[/glossary]</p>',
			 );
		} );
		it( 'Should support whitespaces', () => {
			expect( editorDocumentType.convert(
				`<p><a data-tip-type="${ETipType.Glossarytip}">Glossarytip</a> foo  bar	qux</p>`,
				getShortcodeFormat( fromType ),
				getShortcodeFormat( toType ),
			) ).toEqual(
				'<p>[glossary]Glossarytip[/glossary] foo  bar	qux</p>',
			 );
			expect( editorDocumentType.convert(
				`<p> foo  bar	qux<a data-tip-type="${ETipType.Glossarytip}">Glossarytip</a></p>`,
				getShortcodeFormat( fromType ),
				getShortcodeFormat( toType ),
			 ) ).toEqual(
				'<p> foo  bar	qux[glossary]Glossarytip[/glossary]</p>',
			  );
		} );
	} else if ( fromType === 'QTags' ) {
		it( 'Should add tip uuid', () => {
			expect( maybePostFilterOutput( editorDocumentType.convert(
				'<p>[glossary]Glossarytip[/glossary]</p>',
				getShortcodeFormat( fromType ),
				getShortcodeFormat( toType ),
				),                            EFilterType.Class ) ).toMatch(
					new RegExp( `^${escapeStringRegexp( `<p><a data-tip-type="${ETipType.Glossarytip}" data-tip-uuid="` )}[\\w\\-]+${escapeStringRegexp( '">Glossarytip</a></p>' )}$` ),
				);
		} );
	}

	// (fromType === 'TinyMCE' ? it.only : it.todo.only)
	it.each( maybeFlip( [[
		'<p><a href="#" data-content="<p>Foo <strong>Bar </strong><em>qux </em><span style=&quot;text-decoration: underline;&quot;>baz</span></p>" data-tip-type="Tooltip">Tooltip</a></p><p>&nbsp;</p><p><a href="http://wp-test.local/index.php/glossary/foo/" data-term-id="39" data-tip-type="Glossarytip">Fooo</a></p>',
		'<p>[tooltip href="#" content="<p>Foo <strong>Bar </strong><em>qux </em><span style=&quot;text-decoration: underline;&quot;>baz</span></p>"]Tooltip[/tooltip]</p><p>&nbsp;</p><p>[glossary href="http://wp-test.local/index.php/glossary/foo/" term-id="39"]Fooo[/glossary]</p>',
	],                   [
		'<p><a href="#" data-content="&amp;lt;p&amp;gt;Foo &amp;lt;strong&amp;gt;Bar &amp;lt;/strong&amp;gt;&amp;lt;em&amp;gt;qux &amp;lt;/em&amp;gt;baz&amp;lt;/p&amp;gt;" data-tip-type="Tooltip">Tooltip</a></p><p>&nbsp;</p><p><a href="http://wp-test.local/index.php/glossary/foo/" data-term-id="39" data-tip-type="Glossarytip">Fooo</a></p>',
		'<p>[tooltip href="#" content="&amp;lt;p&amp;gt;Foo &amp;lt;strong&amp;gt;Bar &amp;lt;/strong&amp;gt;&amp;lt;em&amp;gt;qux &amp;lt;/em&amp;gt;baz&amp;lt;/p&amp;gt;"]Tooltip[/tooltip]</p><p>&nbsp;</p><p>[glossary href="http://wp-test.local/index.php/glossary/foo/" term-id="39"]Fooo[/glossary]</p>',
	]] ) )( 'Should handle complex replacement (test n*%d)', ( _index, from, to ) => {
		expect( maybePostFilterOutput( editorDocumentType.convert( from, getShortcodeFormat( fromType ), getShortcodeFormat( toType ) ) ) ).toEqual( to );
	} );

	// it.only( 'Foo' , () => {});
} );
