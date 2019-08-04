export const buttonMock = () => ( {
	disabled: jest.fn(),
} );

export const registerButtons = () => Promise.resolve( {
	addGlossarytip: buttonMock(),
	addTooltip: buttonMock(),
	removeTip: buttonMock(),
} );
