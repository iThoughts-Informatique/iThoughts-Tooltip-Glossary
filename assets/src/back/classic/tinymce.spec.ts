// @ts-ignore
import { plugins } from 'tinymce';

import { ETipType } from '@ithoughts/tooltip-glossary/common';

jest.mock( './forms/tip-form/tip-form' );
// @ts-ignore
import { mount } from './forms/tip-form/tip-form';

import './tinymce';

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
				const buttonMockCall = addButton.mock.calls.find( call => call[0] === 'ithoughts-tooltip-glossary/add-tooltip' );
				expect( buttonMockCall ).toBeTruthy();
				const onClick = buttonMockCall[1].onclick;
				expect( onClick ).toBeInstanceOf( Function );
				// Onclick
				expect( mount ).not.toHaveBeenCalled();
				onClick();
				expect( mount ).toHaveBeenCalledTimes( 1 );

				const { onClose, ...otherArgs } = mount.mock.calls[0][0];
				expect( otherArgs ).toEqual( { text: '', type: ETipType.Tooltip } );
				expect( onClose ).toBeInstanceOf( Function );
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
				expect( mount ).not.toHaveBeenCalled();
				onClick();
				expect( mount ).toHaveBeenCalledTimes( 1 );

				const { onClose, ...otherArgs } = mount.mock.calls[0][0];
				expect( otherArgs ).toEqual( { text: '', type: ETipType.Glossarytip } );
				expect( onClose ).toBeInstanceOf( Function );
			} );
			it.todo( 'Edit existing glossary tip' );
		} );
	} );
} );
