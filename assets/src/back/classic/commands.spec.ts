// @ts-ignore
import { makeMockEditor } from 'tinymce';

import { CSS_NAMESPACE } from '@ithoughts/tooltip-glossary/back/common';
import { ETipType, parseHtmlElement } from '@ithoughts/tooltip-glossary/common';

import * as commands from './commands';
const { loadAttributesFromHtmlElement, loadFromSelection } = commands;

beforeEach( () => {
	jest.clearAllMocks();
} );

describe( 'Loading tip', () => {
	it( 'Should return a valid default object', () => {
		const mockEditor = makeMockEditor();
		mockEditor.selection.getRng.mockReturnValue( { commonAncestorContainer: {}} );
		const loadedTooltip = loadFromSelection( mockEditor, ETipType.Tooltip );
		expect( loadedTooltip ).toEqual( {
			text: '',
			type: ETipType.Tooltip,
		} );
		const loadedGlossarytip = loadFromSelection( mockEditor, ETipType.Glossarytip );
		expect( loadedGlossarytip ).toEqual( {
			text: '',
			type: ETipType.Glossarytip,
		} );
	} );
	it( 'Should get attributes from the direct container', () => {
		const mockEditor = makeMockEditor();
		const mockRng = { commonAncestorContainer: { parentElement: {
			classList: { contains: jest.fn().mockReturnValue( true ) },
		}}};
		mockEditor.selection.getRng.mockReturnValue( mockRng );
		const mockParse: any = {};
		const loadHtmlMock = jest.spyOn( commands, 'loadAttributesFromHtmlElement' ).mockReturnValue( mockParse );

		mockParse.type = ETipType.Tooltip;
		expect( loadFromSelection( mockEditor, ETipType.Tooltip ) ).toBe( mockParse );
		expect( loadHtmlMock ).toHaveBeenCalledWith( mockRng.commonAncestorContainer.parentElement );

		mockParse.type = ETipType.Glossarytip;
		expect( loadFromSelection( mockEditor, ETipType.Glossarytip ) ).toBe( mockParse );
		expect( loadHtmlMock ).toHaveBeenCalledWith( mockRng.commonAncestorContainer.parentElement );
	} );
	it( 'Should get attributes from an ancestor', () => {
		const mockEditor = makeMockEditor();
		const mockRng = { commonAncestorContainer: { parentElement: {
			classList: { contains: jest.fn().mockReturnValue( false ) },
			parentElement: {
				classList: { contains: jest.fn().mockReturnValue( false ) },
				parentElement: {
					classList: { contains: jest.fn().mockReturnValue( true ) },
				},
			},
		}}};
		mockEditor.selection.getRng.mockReturnValue( mockRng );
		const mockParse: any = {};
		const loadHtmlMock = jest.spyOn( commands, 'loadAttributesFromHtmlElement' ).mockReturnValue( mockParse );

		mockParse.type = ETipType.Tooltip;
		expect( loadFromSelection( mockEditor, ETipType.Tooltip ) ).toBe( mockParse );
		expect( loadHtmlMock ).toHaveBeenCalledWith( mockRng.commonAncestorContainer.parentElement.parentElement.parentElement );

		mockParse.type = ETipType.Glossarytip;
		expect( loadFromSelection( mockEditor, ETipType.Glossarytip ) ).toBe( mockParse );
		expect( loadHtmlMock ).toHaveBeenCalledWith( mockRng.commonAncestorContainer.parentElement.parentElement.parentElement );
	} );
	it( 'Should throw if the tip is not of the expected type', () => {
		const mockEditor = makeMockEditor();
		const mockRng = { commonAncestorContainer: { parentElement: {
			classList: { contains: jest.fn().mockReturnValue( true ) },
		}}};
		mockEditor.selection.getRng.mockReturnValue( mockRng );
		const mockParse: any = {};
		jest.spyOn( commands, 'loadAttributesFromHtmlElement' ).mockReturnValue( mockParse );

		mockParse.type = ETipType.Glossarytip;
		expect( () => loadFromSelection( mockEditor, ETipType.Tooltip ) ).toThrowError( TypeError );

		mockParse.type = ETipType.Tooltip;
		expect( () => loadFromSelection( mockEditor, ETipType.Glossarytip ) ).toThrowError( TypeError );
	} );
} );
describe( 'Loading HTML element', () => {
	it( 'Should get Tooltip attributes', () => {
		( parseHtmlElement as jest.Mock ).mockReturnValue( {
			attributes: {
				class: `${CSS_NAMESPACE}-${ETipType.Tooltip}`,
				content: 'Hello world',
				href: 'bar',
			},
			content: 'Foo',
		} );
		const htmlElemMock: any = {};
		expect( loadAttributesFromHtmlElement( htmlElemMock ) ).toEqual( {
			content: 'Hello world',
			linkTarget: 'bar',
			text: 'Foo',
			type: ETipType.Tooltip,
		} );
		expect( parseHtmlElement ).toHaveBeenCalledTimes( 1 );
		expect( parseHtmlElement ).toHaveBeenCalledWith( htmlElemMock );
	} );
	it( 'Should get Glossarytip attributes', () => {
		( parseHtmlElement as jest.Mock ).mockReturnValue( {
			attributes: {
				class: `${CSS_NAMESPACE}-${ETipType.Glossarytip}`,
				href: 'bar',
				termId: 42,
			},
			content: 'Foo',
		} );
		const htmlElemMock: any = {};
		expect( loadAttributesFromHtmlElement( htmlElemMock ) ).toEqual( {
			linkTarget: 'bar',
			termId: 42,
			text: 'Foo',
			type: ETipType.Glossarytip,
		} );
		expect( parseHtmlElement ).toHaveBeenCalledTimes( 1 );
		expect( parseHtmlElement ).toHaveBeenCalledWith( htmlElemMock );
	} );
} );
