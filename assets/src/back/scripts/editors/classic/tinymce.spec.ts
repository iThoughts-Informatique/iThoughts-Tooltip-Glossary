// @ts-ignore
import { plugins } from 'tinymce';

jest.mock( './forms/tip-form' );
// @ts-ignore
import { selfMount } from './forms/tip-form';

import './tinymce';
import { ETipType } from './forms';

beforeEach( () => {
	jest.clearAllMocks();
} );
describe( 'TinyMCE plugin registration', () => {
	const plugin = plugins['ithoughts-tooltip-glossary'];
	it( 'Plugin should have been correctly registered', () => {
		expect( plugin ).toBeTruthy();
	} );
	it.todo( 'Buttons are correctly registered' );
	describe( 'Buttons actions', () => {
		describe( 'Tooltip button should call the form correctly', () => {
			it( 'Initialize new tooltip', () => {
				// Registration
				const addButton = jest.fn();
				plugin( { addButton, contentCSS: [] } );
				console.log( addButton.mock.calls );
				const buttonMockCall = addButton.mock.calls.find( call => call[0] === 'ithoughts-tooltip-glossary/add-tooltip' );
				expect( buttonMockCall ).toBeTruthy();
				const onClick = buttonMockCall[1].onclick;
				expect( onClick ).toBeInstanceOf( Function );
				// Onclick
				expect( selfMount ).not.toHaveBeenCalled();
				onClick();
				expect( selfMount ).toHaveBeenCalledTimes( 1 );
				expect( selfMount.mock.calls[0] ).toEqual( [{ text: '', type: ETipType.Tooltip }] );

			} );
			it.todo( 'Edit existing tooltip' );
		} );
		describe( 'Glossary tip button should call the form correctly', () => {
			it( 'Initialize new glossary tip', () => {
				// Registration
				const addButton = jest.fn();
				plugin( { addButton, contentCSS: [] } );
				const buttonMockCall = addButton.mock.calls.find( call => call[0] === 'ithoughts-tooltip-glossary/add-glossarytip' );
				expect( buttonMockCall ).toBeTruthy();
				const onClick = buttonMockCall[1].onclick;
				expect( onClick ).toBeInstanceOf( Function );
				// Onclick
				expect( selfMount ).not.toHaveBeenCalled();
				onClick();
				expect( selfMount ).toHaveBeenCalledTimes( 1 );
				expect( selfMount.mock.calls[0] ).toEqual( [{ text: '', type: ETipType.Glossarytip }] );

			} );
			it.todo( 'Edit existing glossary tip' );
		} );
	} );
} );
