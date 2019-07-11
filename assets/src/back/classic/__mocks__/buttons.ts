export const registerButtons = jest.fn().mockReturnValue( {
	addGlossarytip: {
		disabled: jest.fn(),
	},
	addTooltip: {
		disabled: jest.fn(),
	},
	removeTip: {
		disabled: jest.fn(),
	},
} );
